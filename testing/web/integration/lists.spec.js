/* eslint-env jest */
import { wait as slowWait, Simulate } from "react-testing-library";
import "dom-testing-library/extend-expect";
import "./common/linkMock";
import "./common/sweetAlertMock";
import { loadApp } from "./common/loadApp";

const wait = (expectation, opts) =>
  slowWait(expectation, { timeout: 500, ...opts });

const loadedApp = async (...args) => {
  const res = await loadApp(args);
  const { container } = res;
  const findByValue = todoText =>
    Array.from(container.querySelectorAll("input")).filter(
      el => el.getAttribute("value") === todoText
    )[0];

  const getTodoByText = todoText => {
    const el = findByValue(todoText);
    if (!el) {
      throw new Error("Todo not visible in the dom");
    }
    return el;
  };

  const queryTodoByText = todoText => findByValue(todoText);

  const queryByTitle = title =>
    Array.from(container.querySelectorAll("*")).filter(
      el => el.title === title
    )[0];

  const getByTitle = title => {
    const el = queryByTitle(title);
    if (!el) {
      throw new Error(`Not found by title ${title}`);
    }
    return el;
  };

  const deleteTodo = name => {
    const found = Array.from(
      findByValue(name, container).parentNode.querySelectorAll("*")
    ).filter(el => el.dataset.testid === "deleteItem");
    Simulate.click(found);
  };

  await wait(() =>
    expect(
      getTodoByText("first todo in the first list", res.container)
    ).toBeTruthy()
  );

  return {
    ...res,
    getTodoByText,
    queryTodoByText,
    queryByTitle,
    getByTitle,
    findByValue,
    deleteTodo
  };
};

test("Rendering component connected to the server", async () => {
  const { getByText, getByAltText } = await loadApp();

  expect(getByAltText("Loading...")).toBeDefined();

  await wait(() => getByText("second list"));
});

test("Show todos for a selected list", async () => {
  const { getByText, getTodoByText } = await loadedApp();

  Simulate.click(getByText("second list"));

  await wait(() => getTodoByText("first todo in the second list"));
});

test("Add list", async () => {
  const { getByText } = await loadedApp();

  Simulate.click(getByText("New List"));

  await wait(() => getByText("Empty List"));

  // TODO Check whether you were redirected
});

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
test("Rename List on blur", async () => {
  const { getByText, getByTestId, findByValue } = await loadedApp();

  Simulate.click(getByTestId("editListName"));

  findByValue("first list").value = "changed list name";
  Simulate.blur(findByValue("first list"));

  // this works because the value is not considered text - so if we can find this by text
  // this means it showed up in the list lists in the menu on the left
  await wait(() => getByText("changed list name"));
});

test("Add Todo", async () => {
  const {
    getByPlaceholderText,
    getByTestId,
    getTodoByText
  } = await loadedApp();

  getByPlaceholderText("Type to add new tasks").value = "Newly Added Todo";
  Simulate.submit(getByTestId("newTodoForm"));

  await wait(() => getTodoByText("Newly Added Todo"));
  expect(getByPlaceholderText("Type to add new tasks").value).toEqual("");
});

// / Optimistic UI for adding the todo

// / Refactor so the inputs are not known to the repositories

test("Remove todo", async () => {
  const { getByTestId, deleteTodo, queryTodoByText } = await loadedApp();

  Simulate.click(getByTestId("deleteItem"));
  deleteTodo("first todo in the first list");

  await wait(() =>
    expect(queryTodoByText("first todo in the second list")).not.toBeInTheDOM()
  );
});

test("check todo", async () => {
  const { getByTitle } = await loadedApp();

  Simulate.change(getByTitle("check-first todo in the first list"));

  await wait(() =>
    expect(getByTitle("check-first todo in the first list").checked).toEqual(
      true
    )
  );
});
test("uncheck todo", () => {});
test("rename todo", () => {});
test("login to see private todo list", () => {});
test("make a list private", () => {});
test("create an account", () => {});

// test that you can't mess with not your lists/todo (in case of todo I think we need to check the owner of the list

// add subscriptions. Test it by calling a mutation as someone else (fake context)
