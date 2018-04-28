import gql from "graphql-tag";

export const allListsQuery = gql`
  query AllLists {
    Lists {
      name
      incompleteCount
    }
  }
`;
