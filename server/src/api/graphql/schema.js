import { makeExecutableSchema } from "graphql-tools";
import { importSchema } from "graphql-import";
import { resolvers } from "./resolvers";

const schema = makeExecutableSchema({
  typeDefs: importSchema(`${__dirname}/schema.graphql`),
  resolvers
});

export default schema;
