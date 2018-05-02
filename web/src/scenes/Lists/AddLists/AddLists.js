import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { allListsQuery } from "shared/graphql/lists/allListsQuery";
import PureAddLists from "./PureAddLists";

const addListMutation = gql`
  mutation AddList($listName: String!) {
    AddList(listName: $listName) {
      name
    }
  }
`;

export default () => (
  <Mutation
    mutation={addListMutation}
    refetchQueries={[{ query: allListsQuery }]}
  >
    {addList => (
      <PureAddLists
        addList={listName => addList({ variables: { listName } })}
      />
    )}
  </Mutation>
);
