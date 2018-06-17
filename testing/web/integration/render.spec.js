/* eslint-env jest */
import { loadApp } from "./common/loadApp";
import { wait } from "./common/tools";

test("Rendering component connected to the server", async () => {
  const {
    rendered: { getByText, getByAltText }
  } = await loadApp();
  expect(getByAltText("Loading...")).toBeDefined();

  await wait(() => getByText("second list"));
});
