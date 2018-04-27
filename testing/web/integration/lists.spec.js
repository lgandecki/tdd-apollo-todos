/* eslint-env jest */
import React from "react";
import { render, wait, Simulate } from "react-testing-library";
import "dom-testing-library/extend-expect";
import PureLists from "../../../web/src/scenes/Lists/PureLists";
import { loadApp } from "./common/loadApp";

test("Rendering the pure component", () => {
  const { getByText } = render(<PureLists />);
  expect(getByText("loading")).toBeDefined();
});

test("Rendering component connected to the server", async () => {
  const { getByText } = await loadApp();
  expect(getByText("loading")).toBeDefined();
  await wait(() => getByText("second list"), { timeout: 500 });
});

test("Add list", async () => {
  const { getByLabelText, getByText } = await loadApp();
  await wait(() => getByLabelText("New List"), { timeout: 500 });
  getByLabelText("New List").value = "Such a beautiful list";
  Simulate.change(getByLabelText("New List"));

  Simulate.click(getByText("Add List"));

  await wait(() => getByText("Such a beautiful list"), { timeout: 500 });
});

test("Remove list", async () => {
  const { queryByText, getByText } = await loadApp();

  await wait(() => getByText("second list"));
  Simulate.click(getByText("second list"));

  await wait(() => expect(queryByText("second list")).not.toBeInTheDOM(), {
    timeout: 500
  });
});
