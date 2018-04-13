/* eslint-env jest */
import React from "react";
import { render } from "react-testing-library";
import PureApp from "../../../web/src/scenes/App/PureApp";

test("Rendering the pure component", () => {
  expect(true).toEqual(true);
  const { getByText } = render(<PureApp />);
  expect(getByText("loading")).toBeDefined();
});
