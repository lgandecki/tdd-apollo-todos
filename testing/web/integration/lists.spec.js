/* eslint-env jest */
import React from "react";
import { wait, Simulate } from "react-testing-library";
import "dom-testing-library/extend-expect";
import { loadApp } from "./common/loadApp";

jest.mock("react-router-dom", () => ({
  Link: props => {
    // eslint-disable-next-line global-require
    const { withRouter } = require("react-router");
    const RealLink = internalProps => {
      const changePath = () => {
        internalProps.history.push(internalProps.to);
      };
      const newProps = { ...internalProps };

      delete newProps.to;
      delete newProps.location;
      delete newProps.match;
      delete newProps.history;
      return (
        <a href={internalProps.to} {...newProps} onClick={changePath}>
          {internalProps.children}
        </a>
      );
    };
    const Wrapped = withRouter(RealLink);
    return <Wrapped {...props} />;
  }
}));

test("Rendering component connected to the server", async () => {
  const { getByText } = await loadApp();
  expect(getByText("loading")).toBeDefined();
  await wait(() => getByText("second list"), { timeout: 500 });
});

test("Add list", async () => {
  const { getByLabelText, getByText, queryByText } = await loadApp();
  await wait(() => expect(queryByText("loading")).not.toBeInTheDOM(), {
    timeout: 500
  });

  getByLabelText("New List").value = "Such a beautiful list";
  Simulate.change(getByLabelText("New List"));
  Simulate.click(getByText("Add List"));

  await wait(() => getByText("Such a beautiful list"), { timeout: 500 });
});

test("Remove list", async () => {
  const { queryByText, getByText } = await loadApp();

  await wait(() => getByText("second list"), { timeout: 500 });
  Simulate.click(getByText("remove second list"));

  await wait(() => expect(queryByText("second list")).not.toBeInTheDOM(), {
    timeout: 500
  });
});

test("Show todos for a selected list", async () => {
  const { getByText } = await loadApp();

  await wait(() => getByText("second list"), { timeout: 500 });

  Simulate.click(getByText("second list"));

  await wait(() => getByText("todo in the second list"), { timeout: 500 });
});
