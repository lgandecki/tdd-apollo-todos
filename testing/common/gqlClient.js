/* eslint-disable import/no-extraneous-dependencies */
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SchemaLink } from "apollo-link-schema";
import { makeExecutableSchema } from "graphql-tools";
import { importSchema } from "graphql-import";
import merge from "lodash/merge";
import { Server, WebSocket } from "mock-socket-with-protocol";
import { SubscriptionServer } from "subscriptions-transport-custom-ws";
import { execute, subscribe } from "graphql";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";

import { resolvers as originalResolvers } from "../../server/src/api/graphql/resolvers";

export default function gqlClient({ context, resolvers = [] }) {
  const schema = makeExecutableSchema({
    typeDefs: importSchema(
      `${__dirname}/../../server/src/api/graphql/schema.graphql`
    ),
    resolvers: merge({}, originalResolvers, ...resolvers)
  });

  const RANDOM_WS_PORT = Math.floor(Math.random() * 100000);
  const customServer = new Server(`ws://localhost:${RANDOM_WS_PORT}`);

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onOperation: (message, params) => ({ ...params, context })
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

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  });
}
