/* eslint-disable import/no-extraneous-dependencies */
import React from "React";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import { execute, subscribe } from "graphql";
import { Server, WebSocket } from "mock-socket-with-protocol";
import { SubscriptionServer } from "subscriptions-transport-custom-ws";
import { ApolloProvider } from "react-apollo";
import createHistory from "history/createBrowserHistory";
import { makeExecutableSchema } from "graphql-tools";
import { importSchema } from "graphql-import";
import merge from "lodash/merge";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { SchemaLink } from "apollo-link-schema";
import { fireEvent, renderIntoDocument } from "react-testing-library";
import { resolvers as originalResolvers } from "../../../server/src/api/graphql/resolvers";
import { loadedApp } from "./common/loadedApp";
import { wait } from "./common/tools";
import App from "../../../web/src/layouts/App";
import getListsWithDefaults from "../../common/getListsWithDefaults";
import { repositories } from "../../../server/src/api/graphql/repositories";
import getUsersWithDefaults from "../../common/getUsersWithDefaults";
import getTodoItemsWithDefaults from "../../common/getTodoItemsWithDefaults";

export default async function gqlClient({ resolvers = [] }) {
  const schema = makeExecutableSchema({
    typeDefs: importSchema(
      `${__dirname}/../../../server/src/api/graphql/schema.graphql`
    ),
    resolvers: merge({}, originalResolvers, ...resolvers)
  });

  const RANDOM_WS_PORT = Math.floor(Math.random() * 100000);
  const customServer = new Server(`ws://localhost:${RANDOM_WS_PORT}`);
  const listsRepository = await getListsWithDefaults();
  const todoItemsRepository = await getTodoItemsWithDefaults();
  const usersRepository = await getUsersWithDefaults();
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
    }
  };

  // We pass customServer instead of typical configuration of a default WebSocket server
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe
    },
    customServer
  );

  // The uri of the WebSocketLink has to match the customServer uri.
  const wsLink = new WebSocketLink({
    uri: `ws://localhost:${RANDOM_WS_PORT}`,
    webSocketImpl: WebSocket
  });

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    new SchemaLink({
      schema,
      context: {
        req: {
          login: () => {}
        },
        ...context
      }
    })
  );

  // Nothing new here
  return {
    client: new ApolloClient({
      link,
      cache: new InMemoryCache()
    }),
    listsRepository
  };
}

const AppWithSubscription = async () => {
  const history = createHistory();
  history.push("/");
  const { client, listsRepository } = await gqlClient({});
  const rendered = renderIntoDocument(
    <ApolloProvider client={client}>
      <App history={history} />
    </ApolloProvider>
  );
  const { getByValue } = rendered;

  await wait(() => getByValue("first todo in the first list"));
  return {
    listsRepository,
    rendered
  };
};

test("subscription", async () => {
  const { rendered: withSub, listsRepository } = await AppWithSubscription();

  const { getByText } = await loadedApp({ listsRepository });
  fireEvent.click(getByText("New List"));
  await wait(() => getByText("Empty List"));

  await wait(() => withSub.getByText("Empty List"));

  // const newApp = await loadedApp({ listsRepository });
  // await wait(() => newApp.getByText("Empty List"));
});
