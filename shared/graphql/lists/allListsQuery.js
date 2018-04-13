import gql from "graphql-tag";

export const allListsQuery = gql`
  query TodoAppQuery {
    Lists {
      name
      incompleteCount
    }
  }
`;
