/* eslint-env jest */
import { Simulate } from "react-testing-library";
import "dom-testing-library/extend-expect";
import waitForExpect from "wait-for-expect";
import "./common/linkMock";
import "./common/sweetAlertMock";
import { loadApp } from "./common/loadApp";

const wait = expectation => waitForExpect(expectation, 500);

const type = (el, value) => {
  Simulate.focus(el);
  // eslint-disable-next-line no-param-reassign
  el.value = value;
  Simulate.change(el);
};

const loadedApp = async (...args) => {
  const loaded = await loadApp(args);
  const { rendered } = loaded;
  const { container, queryByValue } = rendered;
  const findByValue = todoText =>
    Array.from(container.querySelectorAll("input")).filter(
      el => el.getAttribute("value") === todoText
    )[0];

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
    findByValue,
    deleteTodo
  };
};

test("Rendering component connected to the server", async () => {
  const { rendered: { getByText, getByAltText } } = await loadApp();
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

  type(findByValue("first list"), "changed list name");
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

test("check and uncheck todo", async () => {
  const { getByTitle } = await loadedApp();

  Simulate.change(getByTitle("check-first todo in the first list"));

  await wait(() =>
    expect(getByTitle("check-first todo in the first list").checked).toEqual(
      true
    )
  );

  Simulate.change(getByTitle("check-first todo in the first list"));

  await wait(() =>
    expect(getByTitle("check-first todo in the first list").checked).toEqual(
      false
    )
  );
});

// jest fake timers
test("rename todo by typing", async () => {
  const { getTodoByText, todoItemsRepository } = await loadedApp();

  const todoToChange = getTodoByText("first todo in the first list");
  type(todoToChange, "different text now");

  await wait(() =>
    expect(
      todoItemsRepository.todoItemsCollection.findOne({
        text: "different text now"
      })
    ).resolves.not.toBeNull()
  );
});

test("login to see private todo list", () => {});
test("make a list private", () => {});
test("create an account", () => {});

describe("Signing up", () => {
  test("Email Required error", async () => {
    const { getByPlaceholderText, getByText } = await loadedApp();
    Simulate.click(getByText("Join"));
    type(getByPlaceholderText("Password"), "MyPassword");
    type(getByPlaceholderText("Confirm Password"), "MyPassword");
    Simulate.submit(getByText("Join Now"));
    await wait(() => getByText("Email Required"));
  });

  test("Password required error", async () => {
    const { getByText } = await loadedApp();
    Simulate.click(getByText("Join"));
    Simulate.submit(getByText("Join Now"));
    await wait(() => getByText("Password Required"));
  });

  test("Password match error", async () => {
    const { getByText, getByPlaceholderText } = await loadedApp();
    Simulate.click(getByText("Join"));
    type(getByPlaceholderText("Password"), "MyPassword");
    type(getByPlaceholderText("Confirm Password"), "MyAPassword");
    Simulate.submit(getByText("Join Now"));
    await wait(() => getByText("Password doesn't match the confirmation"));
  });
});

// test that you can't mess with not your lists/todo (in case of todo I think we need to check the owner of the list)
// do this mostly in server - as those things are not easy from the UI - should not be even possible to be honest.
// Perfect examples of server tests

// add subscriptions. Test it by calling a mutation as someone else (fake context)

// Problems with ID

// Tests for when no lists exist
// Tests for when no todo exist

// Can I make the syntax .click and .type here, instead of changing cypress tests to use this type() and Simulate.click functions? I think I would have to use proxy.
