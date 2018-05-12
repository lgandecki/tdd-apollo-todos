import gql from "graphql-tag";

export const currentUserQuery = gql`
  query CurrentUser {
    CurrentUser {
      email
    }
  }
`;
