/* eslint-env jest */
import { loadedApp } from "./common/loadedApp";
import { wait } from "./common/tools";

test("Show todos for a selected list", async () => {
  const { getByText, getTodoByText } = await loadedApp();
  getByText("second list").click();

  await wait(() => getTodoByText("first todo in the second list"));
});
