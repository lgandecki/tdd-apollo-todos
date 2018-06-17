/* eslint-env jest */
import { fireEvent } from "react-testing-library";
import { loadedApp } from "./common/loadedApp";
import { wait } from "./common/tools";

test("Add list", async () => {
  const { getByText } = await loadedApp();

  fireEvent.click(getByText("New List"));

  await wait(() => getByText("Empty List"));

  // TODO Check whether you were redirected
});
