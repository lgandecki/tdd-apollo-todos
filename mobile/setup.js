/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies */
// by @amay from https://github.com/kentcdodds/react-testing-library/issues/22#issuecomment-376756260
// waiting for a package!!!
import "react-native-mock-render/mock";
import { Simulate } from "react-dom/test-utils";

function suppressDomErrors() {
  const suppressedErrors = /(React does not recognize the.*prop on a DOM element|Unknown event handler property|is using uppercase HTML|Received `true` for a non-boolean attribute `accessible`|The tag.*is unrecognized in this browser)/;
  // eslint-disable-next-line no-console
  const realConsoleError = console.error;
  // eslint-disable-next-line no-console
  console.error = message => {
    if (message.match(suppressedErrors)) {
      return;
    }
    realConsoleError(message);
  };
}

function setupSimulatePress() {
  Simulate.press = Simulate.click;

  jest.mock("TouchableHighlight", () => {
    // eslint-disable-next-line global-require
    const React = require("react");
    const RealComponent = require.requireActual("TouchableHighlight");
    const TouchableHighlight = props =>
      React.createElement(
        "TouchableHighlight",
        {
          ...props,
          onClick: props.onPress
        },
        props.children
      );
    TouchableHighlight.propTypes = RealComponent.propTypes;
    return TouchableHighlight;
  });
}

suppressDomErrors();
setupSimulatePress();
