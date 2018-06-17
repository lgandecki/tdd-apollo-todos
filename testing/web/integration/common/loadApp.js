import React from "react";
import createHistory from "history/createBrowserHistory";
import { ApolloProvider } from "react-apollo";
import { renderIntoDocument, cleanup } from "react-testing-library";
import "./suppressErrors";
import App from "../../../../web/src/layouts/App";
import { resolvers } from "../../../../server/src/api/graphql/resolvers";
import gqlClient from "../../../common/gqlClient";
import getListsWithDefaults from "../../../common/getListsWithDefaults";
import getTodoItemsWithDefaults from "../../../common/getTodoItemsWithDefaults";
import getUsersWithDefaults from "../../../common/getUsersWithDefaults";

// eslint-disable-next-line jest/no-hooks
beforeEach(cleanup);

export const loadApp = async (passedContext = {}, initialPath = "/") => {
  const repositories = {
    listsRepository:
      passedContext.listsRepository || (await getListsWithDefaults()),
    todoItemsRepository: await getTodoItemsWithDefaults(),
    usersRepository: await getUsersWithDefaults()
  };
  const history = createHistory();
  history.push(initialPath);
  const context = {
    user: {},
    ...repositories,
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
    ...repositories
  };
};
