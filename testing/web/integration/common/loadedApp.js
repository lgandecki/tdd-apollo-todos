import { Simulate } from "react-testing-library";
import "dom-testing-library/extend-expect";
import "./linkMock";
import "./sweetAlertMock";
import { loadApp } from "./loadApp";
import { wait } from "./tools";

export const loadedApp = async (...args) => {
  const loaded = await loadApp(args);
  const { rendered } = loaded;
  const { container, queryByValue } = rendered;

  const getTodoByText = todoText => {
    const el = queryByValue(todoText);
    if (!el) {
      throw new Error("Todo not visible in the dom");
    }
    return el;
  };

  const queryTodoByText = todoText => queryByValue(todoText);

  const deleteTodo = name => {
    const found = Array.from(
      queryByValue(name, container).parentNode.querySelectorAll("*")
    ).filter(el => el.dataset.testid === "deleteItem");
    Simulate.click(found);
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
