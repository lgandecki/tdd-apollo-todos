/* eslint-disable import/no-extraneous-dependencies */
import merge from "lodash/merge";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import importedSchema from "../../../schema.graphql";

const mocks = {
  TodoItem: () => ({
    text: "my text",
    checked: false
  }),
  List: () => ({
    name: "my list"
  }),
  User: () => ({
    email: "lukaszgandecki@thebrain.pro"
  })
};

export default customResolvers => {
  // currently not needed, but if we want to create global resolvers/mutations, (that could be overwritten!), this is the place for it
  const resolvers = {
    Query: {},
    Mutation: {}
  };

  const schema = makeExecutableSchema({
    typeDefs: importedSchema,
    resolvers: merge(resolvers, customResolvers)
  });
  addMockFunctionsToSchema({ schema, preserveResolvers: true, mocks });
  return schema;
};
