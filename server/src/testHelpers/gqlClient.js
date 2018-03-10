/* eslint-disable import/no-extraneous-dependencies */
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SchemaLink } from "apollo-link-schema";
import schema from "../api/graphql/listsResolvers/schema";

export default function gqlClient(context) {
  return new ApolloClient({
    link: new SchemaLink({
      schema,
      context
    }),
    cache: new InMemoryCache()
  });
}
