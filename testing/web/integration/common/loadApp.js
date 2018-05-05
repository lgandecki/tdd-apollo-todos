import React from "react";
import createHistory from "history/createBrowserHistory";
import { ApolloProvider } from "react-apollo";
import { render } from "react-testing-library";
// import Routes from "../../../../web/src/Routes";
import App from "../../../../web/src/layouts/App";
import { resolvers } from "../../../../server/src/api/graphql/resolvers";
import gqlClient from "../../../common/gqlClient";
import getListsWithDefaults from "../../../common/getListsWithDefaults";
import { repositories } from "../../../../server/src/api/graphql/repositories";
import getTodoItemsWithDefaults from "../../../common/getTodoItemsWithDefaults";

export const loadApp = async (context = {}, initialPath = "/") => {
  const listsRepository = await getListsWithDefaults();
  const todoItemsRepository = await getTodoItemsWithDefaults();
  const history = createHistory();
  history.push(initialPath);
  return {
    rendered: render(
      <ApolloProvider
        client={gqlClient({
          context: {
            ...repositories,
            listsRepository,
            todoItemsRepository,
            ...context
          },
          resolvers: [resolvers]
        })}
      >
        <App history={history} />
      </ApolloProvider>
    ),
    listsRepository,
    todoItemsRepository
  };
};
