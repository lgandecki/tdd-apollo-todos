/* eslint-env jest */
import { fireEvent } from "react-testing-library";
import { loadedApp } from "./common/loadedApp";
import { wait } from "./common/tools";

test("Remove todo", async () => {
  const { getByTestId, deleteTodo, queryTodoByText } = await loadedApp();

  fireEvent.click(getByTestId("deleteItem"));
  deleteTodo("first todo in the first list");

  await wait(() =>
    expect(queryTodoByText("first todo in the first list")).not.toBeInTheDOM()
  );
});
