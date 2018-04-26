/* eslint-env jest */
import React from "react";
import { render, wait } from "react-testing-library";
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
