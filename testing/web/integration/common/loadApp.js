import React from "react";
import createHistory from "history/createBrowserHistory";
import { ApolloProvider } from "react-apollo";
import { renderIntoDocument } from "react-testing-library";
import App from "../../../../web/src/layouts/App";
import { resolvers } from "../../../../server/src/api/graphql/resolvers";
import gqlClient from "../../../common/gqlClient";
import getListsWithDefaults from "../../../common/getListsWithDefaults";
import { repositories } from "../../../../server/src/api/graphql/repositories";
import getTodoItemsWithDefaults from "../../../common/getTodoItemsWithDefaults";
import getUsersWithDefaults from "../../../common/getUsersWithDefaults";

export const loadApp = async (passedContext = {}, initialPath = "/") => {
  const listsRepository = await getListsWithDefaults();
  const todoItemsRepository = await getTodoItemsWithDefaults();
  const usersRepository = await getUsersWithDefaults();
  const history = createHistory();
  history.push(initialPath);
  const context = {
    user: {},
    ...repositories,
    listsRepository,
    todoItemsRepository,
    usersRepository,
    req: {
      logIn: user => {
        Object.assign(context.user, user);
      },
      logOut: () => {
        delete context.user._id;
        delete context.user.email;
      }
    },
    ...passedContext
  };
  return {
    rendered: renderIntoDocument(
      <ApolloProvider
        client={gqlClient({
          context,
          resolvers: [resolvers]
        })}
      >
        <App history={history} />
      </ApolloProvider>
    ),
    listsRepository,
    todoItemsRepository,
    usersRepository
  };
};
