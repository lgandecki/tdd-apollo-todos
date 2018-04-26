import React from "react";
import createHistory from "history/createBrowserHistory";
import { ApolloProvider } from "react-apollo";
import { render } from "react-testing-library";
import Routes from "../../../../web/src/Routes";
import { resolvers } from "../../../../server/src/api/graphql/resolvers";
import gqlClient from "../../../common/gqlClient";
import getListsWithDefaults from "../../../common/getListsWithDefaults";
import { repositories } from "../../../../server/src/api/graphql/repositories";

export const loadApp = async (context = {}, initialPath = "/") => {
  const listsRepository = await getListsWithDefaults();
  const history = createHistory();
  history.push(initialPath);
  return render(
    <ApolloProvider
      client={gqlClient({
        context: { ...repositories, listsRepository, ...context },
        resolvers: [resolvers]
      })}
    >
      <Routes history={history} />
    </ApolloProvider>
  );
};
