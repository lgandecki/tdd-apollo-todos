import { makeExecutableSchema } from "graphql-tools";
import listsResolvers from "./listsResolvers";

const gql = schema => schema;

const typeDefs = gql`
  type List {
    _id: String
    name: String
    incompleteCount: Int
  }

  type Query {
    Lists: [List]
  }
`;

const resolvers = listsResolvers;
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
