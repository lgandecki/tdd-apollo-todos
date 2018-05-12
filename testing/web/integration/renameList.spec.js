import { fireEvent } from "react-testing-library";
import { type, wait } from "./common/tools";
import { loadedApp } from "./common/loadedApp";

test("Rename List on blur", async () => {
  const { getByText, getByTestId, getByValue } = await loadedApp();

  fireEvent.click(getByTestId("editListName"));

  type(getByValue("first list"), "changed list name");
  fireEvent.blur(getByValue("first list"));

  // this works because the value is not considered text - so if we can find this by text
  // this means it showed up in the list lists in the menu on the left
  await wait(() => getByText("changed list name"));
});

test("Rename List on form submit", async () => {
  const { getByText, getByTestId, getByValue } = await loadedApp();

  fireEvent.click(getByTestId("editListName"));

  type(getByValue("first list"), "changed list name");
  fireEvent.submit(getByValue("first list"));

  await wait(() => getByText("changed list name"));
});
