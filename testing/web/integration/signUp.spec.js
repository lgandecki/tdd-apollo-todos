import { Simulate } from "react-testing-library";
import { type, wait } from "./common/tools";
import { loadedApp } from "./common/loadedApp";

describe("Signing up", () => {
  test("Email Required error", async () => {
    const { getByPlaceholderText, getByText } = await loadedApp();
    Simulate.click(getByText("Join"));
    type(getByPlaceholderText("Password"), "MyPassword");
    type(getByPlaceholderText("Confirm Password"), "MyPassword");
    Simulate.submit(getByText("Join Now"));
    await wait(() => getByText("Email Required"));
  });

  test("Password required error", async () => {
    const { getByText } = await loadedApp();
    Simulate.click(getByText("Join"));
    Simulate.submit(getByText("Join Now"));
    await wait(() => getByText("Password Required"));
  });

  test("Password match error", async () => {
    const { getByText, getByPlaceholderText } = await loadedApp();
    Simulate.click(getByText("Join"));
    type(getByPlaceholderText("Password"), "MyPassword");
    type(getByPlaceholderText("Confirm Password"), "MyAPassword");
    Simulate.submit(getByText("Join Now"));
    await wait(() => getByText("Password doesn't match the confirmation"));
  });
});
