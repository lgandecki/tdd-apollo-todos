/* eslint-env jest, cypress/globals */

// so much going on here - for now I'm disabling the eslint.
import { makeExecutableSchema } from "graphql-tools";
import { SchemaLink } from "apollo-link-schema";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import merge from "lodash/merge";
import "./../cypress/support/setupProcessEnv";
import getListsWithDefaults from "../../common/getListsWithDefaults";
import getTodoItemsWithDefaults from "../../common/getTodoItemsWithDefaults";
import { resolvers } from "../../../server/src/api/graphql/resolvers";
// import { repositories } from "server/src/api/graphql/repositories";
import importedSchema from "../../../schema.graphql";

import getUsersWithDefaults from "../../common/getUsersWithDefaults";

const {
  getByText,
  getByTitle,
  queryByTitle,
  queryByText,
  getByPlaceholderText,
  getByTestId
} = cy;

function gqlClient({ context, resolvers: passedResolvers = [] }) {
  console.log("Gandecki resolvers", passedResolvers);
  const schema = makeExecutableSchema({
    typeDefs: [importedSchema],
    resolvers: merge({}, ...passedResolvers)
  });
  return new ApolloClient({
    link: new SchemaLink({
      schema,
      context
    }),
    cache: new InMemoryCache()
  });
}

const getApolloClient = async (passedContext = {}) => {
  process.env.BABEL_ENV = "test";
  console.log("Gandecki process.env.BABEL_ENV", process.env.BABEL_ENV);

  const listsRepository = await getListsWithDefaults();
  await listsRepository.listsCollection.insert({
    _id: "thirdId",
    name: "third list",
    incompleteCount: 0
  });
  const usersRepository = await getUsersWithDefaults();

  const todoItemsRepository = await getTodoItemsWithDefaults();
  const context = {
    user: {},
    listsRepository,
    todoItemsRepository,
    usersRepository,
    req: {
      logIn: user => {
        Object.assign(context.user, user);
      },
      logOut: () => {
        console.log("log out");
        delete context.user._id;
        delete context.user.email;
      }
    },
    ...passedContext
  };
  return gqlClient({
    context,
    resolvers: [resolvers]
  });
};

const Simulate = {
  click: el => {
    el.click();
  }
};

const fireEvent = Simulate;
const wait = cb => cb();

const type = (el, value) => {
  el.type(value, { delay: 1 });
};
describe("working without the server", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(done => {
    cy.visit(`http://localhost:3000`, {
      onLoad: win => {
        cy.spy(win.console, "log");
        if (win.__APOLLO_CLIENT__) {
          return getApolloClient()
            .then(apolloClient => {
              Object.assign(win.__APOLLO_CLIENT__.link, apolloClient.link);
              win.__APOLLO_CLIENT__.resetStore();
              done();
            })
            .catch(e => {
              console.log("Gandecki e", e);
            });
        }
        return null;
      },
      onBeforeLoad: win => {
        win.sessionStorage.clear();
      }
    });
  });
  it("shows lists coming from the server", () => {
    getByText("second list").click();
  });

  it("Add List", () => {
    Simulate.click(getByText("New List"));

    wait(() => getByText("Empty List"));
  });
  it("Remove list and redirect", () => {
    getByTitle("third list").should("exist");

    Simulate.click(cy.getByTitle("Delete list"));
    Simulate.click(getByText("Delete it!"));

    queryByTitle("first list").should("not.exist");
    // should verify by the actual todo "first todo in the first list"
  });
  it("allows the user to sign up and log out and log back in", () => {
    Simulate.click(getByText("Join"));
    type(getByPlaceholderText("Your Email"), "lgandecki@thebrain.pro");
    type(getByPlaceholderText("Password"), "MyPassword");
    type(getByPlaceholderText("Confirm Password"), "MyPassword");
    Simulate.click(getByText("Join Now"));
    getByText("lgandecki");
    queryByText("Join Now").should("not.exist");
    Simulate.click(getByTitle("Make list private"));
    getByTitle("Make list public");
    Simulate.click(getByText("lgandecki"));
    Simulate.click(getByText(/Logout/));
    queryByText("first list").should("not.exist");
    Simulate.click(getByText("Sign In"));
  });

  it("check and uncheck todo", () => {
    fireEvent.click(getByTitle("check-first todo in the first list"));
    getByTestId("checkbox-first todo in the first list").should("be.checked");
    fireEvent.click(getByTitle("check-first todo in the first list"));
    getByTestId("checkbox-first todo in the first list").should(
      "not.be.checked"
    );
  });
});
