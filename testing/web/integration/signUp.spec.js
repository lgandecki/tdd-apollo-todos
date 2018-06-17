/* eslint-env jest */
import { fireEvent } from "react-testing-library";

import { loadedApp } from "./common/loadedApp";
import { wait, type } from "./common/tools";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

// This way we verify that the way we create user is correct.
// If we only tested registering user, and then used a mocked user in all other tests
// this crucial part of the app would be left unsafe.
// For example - if creating the user messed up saving the password:
// - You would still get in so this test would pass
// - All the tests that assume properly created user would fail
// Another way to do this would be to go straight for the db and verify correctly created user

// TODO The more I think about it - I think it would be better to split those tests and verify the db,
// or even go directly to the repository and try to log in with the given username and password

// I think there is a value in one/two tests that check all the wiring up of the user grounds up, including whether the private data is getting properly displayed/not displayed
// But the actual functionality should probably have separate tests anyway
// so we would need to add making list private/public

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
  getByText(/Logout/).click();
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
