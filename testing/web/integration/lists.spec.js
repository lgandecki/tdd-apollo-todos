/* eslint-env jest */
import { fireEvent } from "react-testing-library";
import { loadedApp } from "./common/loadedApp";
import { loadApp } from "./common/loadApp";
import { wait, type } from "./common/tools";

test("Rendering component connected to the server", async () => {
  const {
    rendered: { getByText, getByAltText }
  } = await loadApp();
  expect(getByAltText("Loading...")).toBeDefined();

  await wait(() => getByText("second list"));
});

test("Show todos for a selected list", async () => {
  const { getByText, getTodoByText } = await loadedApp();
  fireEvent.click(getByText("second list"));

  await wait(() => getTodoByText("first todo in the second list"));
});

test("Add list", async () => {
  const { getByText } = await loadedApp();

  fireEvent.click(getByText("New List"));

  await wait(() => getByText("Empty List"));

  // TODO Check whether you were redirected
});

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

// / Refactor so the inputs are not known to the repositories

test("Remove todo", async () => {
  const { getByTestId, deleteTodo, queryTodoByText } = await loadedApp();

  fireEvent.click(getByTestId("deleteItem"));
  deleteTodo("first todo in the first list");

  await wait(() =>
    expect(queryTodoByText("first todo in the second list")).not.toBeInTheDOM()
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

// This way we verify that the way we create user is correct.
// If we only tested registering user, and then used a mocked user in all other tests
// this crucial part of the app would be left unsafe.
// For example - if creating the user messed up saving the password:
// - You would still get in so this test would pass
// - All the tests that assume properly created user would fail
// Another way to do this would be to go straight for the db and verify correctly created user

// TODO The more I think about it - I think it would be better to split those tests and verify the db,
// or even go directly to the repository and try to log in with the given username and password
test("Register user, logout, login", async () => {
  const {
    getByText,
    getByPlaceholderText,
    queryByText,
    getByTitle
  } = await loadedApp();

  fireEvent.click(getByText("Join"));
  type(getByPlaceholderText("Your Email"), "lgandecki@thebrain.pro");
  type(getByPlaceholderText("Password"), "MyPassword");
  type(getByPlaceholderText("Confirm Password"), "MyPassword");
  fireEvent.click(getByText("Join Now"));
  await wait(() => getByText("lgandecki"));
  await wait(() => expect(queryByText("Join Now")).not.toBeInTheDOM());
  fireEvent.click(getByTitle("Make list private"));
  await wait(() => getByTitle("Make list public"));
  fireEvent.click(getByText("lgandecki"));
  fireEvent.click(getByText(/Logout/));
  await wait(() => expect(queryByText("lgandecki")).not.toBeInTheDOM());
  await wait(() => expect(queryByText("first list")).not.toBeInTheDOM());
  // const users = await usersRepository.usersCollection.find().toArray();
  // console.log("Gandecki users", users);
});

test("Register logout login", async () => {
  const {
    getByText,
    getByPlaceholderText,
    queryByText,
    getByTitle,
    getByTestId
  } = await loadedApp();

  fireEvent.click(getByText("Join"));
  type(getByPlaceholderText("Your Email"), "lgandecki@thebrain.pro");
  type(getByPlaceholderText("Password"), "MyPassword");
  type(getByPlaceholderText("Confirm Password"), "MyPassword");
  fireEvent.click(getByText("Join Now"));
  await wait(() => getByText("lgandecki"));
  await wait(() => expect(queryByText("Join Now")).not.toBeInTheDOM());
  fireEvent.click(getByTitle("Make list private"));
  await wait(() => getByTitle("Make list public"));
  await wait(() => expect(queryByText("first list")).toBeInTheDOM());
  fireEvent.click(getByText("lgandecki"));
  fireEvent.click(getByText(/Logout/));
  await wait(() => expect(queryByText("lgandecki")).not.toBeInTheDOM());
  await wait(() => expect(queryByText("first list")).not.toBeInTheDOM());

  fireEvent.click(getByText("Sign In"));
  type(getByPlaceholderText("Your Email"), "lgandecki@thebrain.pro");
  type(getByPlaceholderText("Password"), "MyPassword");
  fireEvent.click(getByTestId("signInNow"));
  await wait(() => expect(queryByText("lgandecki")).toBeInTheDOM());
  await wait(() => expect(queryByText("first list")).toBeInTheDOM());
});

// test that you can't mess with not your lists/todo (in case of todo I think we need to check the owner of the list)
// do this mostly in server - as those things are not easy from the UI - should not be even possible to be honest.
// Perfect examples of server tests

// add subscriptions. Test it by calling a mutation as someone else (fake context)

// Problems with ID

// Tests for when no lists exist
// Tests for when no todo exist

// Can I make the syntax .click and .type here, instead of changing cypress tests to use this type() and fireEvent.click functions? I think I would have to use proxy.
