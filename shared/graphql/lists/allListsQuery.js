import gql from "graphql-tag";

export const allListsQuery = gql`
  query AllLists {
    Lists {
      _id
      name
      incompleteCount
    }
  }
`;
