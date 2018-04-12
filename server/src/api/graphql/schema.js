import { makeExecutableSchema } from "graphql-tools";
import merge from "lodash/merge";
import { importSchema } from "graphql-import";
import listsResolvers from "./lists/listsResolvers";

const resolvers = merge({}, listsResolvers);
const schema = makeExecutableSchema({
  typeDefs: importSchema(`${__dirname}/schema.graphql`),
  resolvers
});

export default schema;
