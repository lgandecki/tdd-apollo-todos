import { fireEvent } from "react-testing-library";
import "dom-testing-library/extend-expect";
import { loadApp } from "./loadApp";
import { wait } from "./tools";

export const loadedApp = async (...args) => {
  const loaded = await loadApp(...args);
  const { rendered } = loaded;
  const { container, queryByValue, getByValue } = rendered;

  const getTodoByText = todoText => getByValue(todoText);

  const queryTodoByText = todoText => queryByValue(todoText);

  const deleteTodo = name => {
    const found = Array.from(
      queryByValue(name, container).parentNode.querySelectorAll("*")
    ).filter(el => el.dataset.testid === "deleteItem")[0];
    fireEvent.click(found);
  };

  await wait(() =>
    expect(
      getTodoByText("first todo in the first list", container)
    ).toBeTruthy()
  );

  return {
    ...rendered,
    ...loaded,
    getTodoByText,
    queryTodoByText,
    deleteTodo
  };
};
