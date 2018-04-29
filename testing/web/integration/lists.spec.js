/* eslint-env jest */
import { wait, Simulate } from "react-testing-library";
import "dom-testing-library/extend-expect";
import "./common/linkMock";
import { loadApp } from "./common/loadApp";

const findTodo = (todoText, container) =>
  Array.from(container.querySelectorAll("input")).filter(
    el => el.getAttribute("value") === todoText
  );

const isTodoShown = (todoText, container) =>
  findTodo(todoText, container).length > 0;

test("Rendering component connected to the server", async () => {
  const { getByText, getByAltText } = await loadApp();
  expect(getByAltText("Loading...")).toBeDefined();
  await wait(() => getByText("second list"), { timeout: 500 });
});

test("Show todos for a selected list", async () => {
  const { getByText, container } = await loadApp();

  await wait(() => getByText("second list"), { timeout: 500 });

  Simulate.click(getByText("second list"));

  await wait(
    () =>
      expect(isTodoShown("todo in the second list", container)).toBeTruthy(),
    { timeout: 500 }
  );
});

test.skip("Add list", async () => {
  const { getByLabelText, getByText, queryByText } = await loadApp();
  await wait(() => expect(queryByText("loading")).not.toBeInTheDOM(), {
    timeout: 500
  });

  getByLabelText("New List").value = "Such a beautiful list";
  Simulate.change(getByLabelText("New List"));
  Simulate.click(getByText("Add List"));

  await wait(() => getByText("Such a beautiful list"), { timeout: 500 });
});

const deleteTodo = (name, container) => {
  const found = Array.from(
    findTodo(name, container)[0].parentNode.querySelectorAll("*")
  ).filter(el => el.dataset.testid === "deleteItem");
  Simulate.click(found);
};

test("Remove todo", async () => {
  const { getByTestId, container } = await loadApp();

  await wait(
    () => expect(isTodoShown("todo in the first list", container)).toBeTruthy(),
    { timeout: 500 }
  );

  Simulate.click(getByTestId("deleteItem"));
  deleteTodo("todo in the first list", container);

  await wait(
    () => expect(isTodoShown("todo in the first list", container)).toBeFalsy(),
    {
      timeout: 500
    }
  );
});
