import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { allListsQuery } from "shared/graphql/lists/allListsQuery";
import PureDisplayLists from "./PureDisplayLists";

const removeListMutation = gql`
  mutation RemoveList($ListName: String!) {
    RemoveList(ListName: $ListName)
  }
`;

export default () => (
  <Query query={allListsQuery}>
    {({ loading, data }) => {
      if (loading) {
        return <div data-cy="loading">Loading...</div>;
      }
      const { Lists } = data;
      return (
        <Mutation mutation={removeListMutation}>
          {removeList => {
            const removeListNew = name => {
              removeList({
                variables: { ListName: name },
                refetchQueries: ["AllLists"]
              });
            };
            return (
              <PureDisplayLists lists={Lists} removeList={removeListNew} />
            );
          }}
        </Mutation>
      );
    }}
  </Query>
);
