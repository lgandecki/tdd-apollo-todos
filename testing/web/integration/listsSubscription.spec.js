/* eslint-disable import/no-extraneous-dependencies */
import { queryAllByText } from "dom-testing-library";
import { within } from "react-testing-library";
import { loadedApp } from "./common/loadedApp";
import { wait, waitForElement } from "./common/tools";

test("newly added list shows up in a second browser", async () => {
  const { rendered: withSub, listsRepository } = await loadedApp();

  const { getByText } = await loadedApp({ listsRepository });
  getByText("New List").click();
  await waitForElement(() => getByText("Empty List"));

  await waitForElement(() => withSub.getByText("Empty List"));
});

// TODO Somehow I subscribed twice and get the results twice
// login in does that :-)
// somehow disable the previous subscription before starting a new one

test("making list private makes it disappear from other users, and vice versa", async () => {
  const { listsRepository, container: browserOneContainer } = await loadedApp();
  // TODO Extract user to a constant user
  const { container: browserTwoContainer } = await loadedApp({
    listsRepository,
    user: { _id: "loggedIn", email: "lgandecki@thebrain.pro", password: "abc" }
  });
  const browserTwo = within(browserTwoContainer);
  await wait(() => browserTwo.getByTitle("Make list private"));
  browserTwo.getByTitle("Make list private").click();

  const browserOne = within(browserOneContainer);
  await wait(() =>
    expect(
      within(browserOneContainer).queryByText("first list")
    ).not.toBeInTheDOM()
  );
  await waitForElement(() => browserTwo.getByText("first list"));

  // vice versa - make sure it shows up again
  browserTwo.getByTitle("Make list public").click();
  await waitForElement(() => browserOne.getByText("first list"));

  // regression test - list should not be added again to the user that makes it public
  const firstListLinks = queryAllByText(
    browserTwo.getByTestId("list-todos"),
    "first list"
  );

  expect(firstListLinks).toHaveLength(1);
});
