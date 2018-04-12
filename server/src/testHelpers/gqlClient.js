/* eslint-disable import/no-extraneous-dependencies */
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SchemaLink } from "apollo-link-schema";
import { makeExecutableSchema } from "graphql-tools";
import { importSchema } from "graphql-import";
import merge from "lodash/merge";

export default function gqlClient({ context, resolvers = [] }) {
  const schema = makeExecutableSchema({
    typeDefs: importSchema(`${__dirname}/../api/graphql/schema.graphql`),
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
