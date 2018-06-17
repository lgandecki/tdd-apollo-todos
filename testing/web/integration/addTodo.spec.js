/* eslint-env jest */
import { fireEvent } from "react-testing-library";
import { loadedApp } from "./common/loadedApp";
import { wait } from "./common/tools";

test("Add Todo", async () => {
  const {
    getByPlaceholderText,
    getByTestId,
    getTodoByText
  } = await loadedApp();

  getByPlaceholderText("Type to add new tasks").value = "Newly Added Todo";
  fireEvent.submit(getByTestId("newTodoForm"));

  await wait(() => getTodoByText("Newly Added Todo"));
  expect(getByPlaceholderText("Type to add new tasks").value).toEqual("");
});
// / Optimistic UI for adding the todo
// TODO Test that the optimistic UI works - we would have to "slow down the response"

// TODO Refactor so the inputs are not known to the repositories
