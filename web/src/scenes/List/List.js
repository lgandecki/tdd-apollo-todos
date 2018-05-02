/* eslint-disable react/prop-types */
import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PureList from "./PureList";

const showTodoItemsForList = gql`
  query TodoItems($listId: ID!) {
    TodoItems(listId: $listId) {
      _id
      checked
      text
    }
  }
`;

export default props => (
  <Query
    query={showTodoItemsForList}
    variables={{ listId: props.match.params.listId }}
  >
    {({ loading, data }) => {
      if (loading) {
        return <div data-cy="loading">Loading...</div>;
      }
      const { TodoItems } = data;
      return <PureList todoItems={TodoItems} />;
    }}
  </Query>
);
