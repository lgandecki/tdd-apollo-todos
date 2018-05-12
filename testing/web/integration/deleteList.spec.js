import { Simulate } from "react-testing-library";
import { wait } from "./common/tools";
import { loadedApp } from "./common/loadedApp";

test("Delete Lists and redirects you to the first available from the list", async () => {
  const {
    queryByTitle,
    getByText,
    queryByText,
    getTodoByText
  } = await loadedApp();
  expect(queryByText("first list")).toBeInTheDOM();

  Simulate.click(queryByTitle("Delete list"));
  Simulate.click(getByText("Delete it!"));
  await wait(() => expect(queryByText("first list")).not.toBeInTheDOM());

  await wait(() => getTodoByText("first todo in the second list"));
});

test("Do not delete list when cancelled", async () => {
  const sleep = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

  const {
    queryByTitle,
    getTodoByText,
    getByText,
    queryByText
  } = await loadedApp();

  expect(queryByText("first list")).toBeInTheDOM();

  Simulate.click(queryByTitle("Delete list"));
  Simulate.click(getByText("Nope"));

  await sleep(100); // We wait to make sure that nothing gets deleted,
  // if we checked right away, there is a chance that UI didn't have enough time to react YET

  await wait(() => getTodoByText("first todo in the first list"));
});
