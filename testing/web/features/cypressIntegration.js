/* eslint-disable */
/* eslint-env jest, cypress/globals */

// so much going on here - for now I'm disabling the eslint.
import { makeExecutableSchema } from "graphql-tools";
import { SchemaLink } from "apollo-link-schema";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import "./../cypress/support/setupProcessEnv";
import getListsWithDefaults from "../../common/getListsWithDefaults";
import getTodoItemsWithDefaults from "../../common/getTodoItemsWithDefaults";
import { resolvers } from "../../../server/src/api/graphql/resolvers";
// import { repositories } from "server/src/api/graphql/repositories";
import importedSchema from "../../../schema.graphql";
import merge from "lodash/merge";

import { queries, waitForElement } from "dom-testing-library";

const findByValue = todoText =>
  Array.from(document.querySelectorAll("input")).filter(
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
//
// const queryByTitle = title =>
//   Array.from(document.querySelectorAll("*")).filter(
//     el => el.title === title
//   )[0];
//
// const getByTitlePure = title => {
//   const el = queryByTitle(title);
//   if (!el) {
//     throw new Error(`Not found by title ${title}`);
//   }
//   return el;
// };

const deleteTodo = name => {
  const found = Array.from(
    findByValue(name, document).parentNode.querySelectorAll("*")
  ).filter(el => el.dataset.testid === "deleteItem");
  Simulate.click(found);
};

function firstResultOrNull(queryFunction, ...args) {
  const result = queryFunction(...args);
  if (result.length === 0) return null;
  return result[0];
}

function queryAllByTitle(container, title, { selector = "*" } = {}) {
  return Array.from(container.querySelectorAll(selector)).filter(
    el => el.title === title
  );
}
//
// function queryByTitle(container, title, opts) {
//   return firstResultOrNull(queryAllByTitle, container, title, opts);
// }

function getAllByTitle(container, title, ...rest) {
  const els = queryAllByTitle(container, title, ...rest);
  if (!els.length) {
    throw new Error(
      `Unable to find an element with the text: ${title}. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible. \n\n`
    );
  }
  return els;
}

function getByTitlePure(...args) {
  return firstResultOrNull(getAllByTitle, ...args);
}

const commands = [];
const returnCypressCommand = (queryName, queryImpl) => ({
  name: queryName,
  command: (cy, ...args) => {
    console.log("Gandecki queryImpl", queryImpl);
    const commandImpl = doc =>
      waitForElement(() => queryImpl(doc, ...args), {
        container: doc,
        timeout: 1000
      })
        .then(res => res)
        .catch(e => doc.querySelector(".cypressNotExistingSelector"));
    const thenHandler = new Function(
      "commandImpl",
      `
            return function Command__${queryName}(thenArgs) {
                return commandImpl(thenArgs.document)
            }
          `
    )(commandImpl);
    return cy
      .window({ log: false })
      .then(thenHandler)
      .then(subject => {
        Cypress.log({
          $el: subject,
          name: queryName,
          message: args
        });
        console.log("Gandecki subject", subject);
        return subject;
      });
  }
});
//
const newCommand = returnCypressCommand("getByTitlePureNew", getByTitlePure);
Cypress.Commands.add(newCommand.name, newCommand.command.bind(null, cy));

const { getByText, getByTitle, queryByTitle } = cy;

function gqlClient({ context, resolvers = [] }) {
  const schema = makeExecutableSchema({
    typeDefs: [importedSchema],
    resolvers: merge({}, ...resolvers)
  });
  return new ApolloClient({
    link: new SchemaLink({
      schema,
      context
    }),
    cache: new InMemoryCache()
  });
}

const getApolloClient = async (context = {}) => {
  process.env.BABEL_ENV = "test";
  console.log("Gandecki process.env.BABEL_ENV", process.env.BABEL_ENV);

  const listsRepository = await getListsWithDefaults();
  await listsRepository.listsCollection.insert({
    _id: "thirdId",
    name: "third list",
    incompleteCount: 0
  });
  const todoItemsRepository = await getTodoItemsWithDefaults();
  return gqlClient({
    context: {
      listsRepository,
      todoItemsRepository
    },
    resolvers: [resolvers]
  });
};

const Simulate = {
  click: el => {
    el.click();
  }
};
const wait = cb => cb();

describe("working without the server", () => {
  beforeEach(() => {
    cy.visit(`http://localhost:3000`, {
      onLoad: win => {
        cy.spy(win.console, "log");
        if (win.__APOLLO_CLIENT__) {
          return getApolloClient()
            .then(apolloClient => {
              Object.assign(win.__APOLLO_CLIENT__.link, apolloClient.link);
              win.__APOLLO_CLIENT__.resetStore();
            })
            .catch(e => {
              console.log("Gandecki e", e);
            });
        }
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

    queryByTitle("second list").should("not.exist");
    // should verify by the actual todo "first todo in the first list"
  });
});
