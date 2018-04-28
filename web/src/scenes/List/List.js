/* eslint-disable react/prop-types */
import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const showTodoItemsForList = gql`
  query TodoItems($ListId: ID!) {
    TodoItems(ListId: $ListId) {
      _id
      isCompleted
      name
    }
  }
`;

export default props => (
  <Query
    query={showTodoItemsForList}
    variables={{ ListId: props.match.params.listId }}
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

const PureList = props => {
  console.log("Gandecki props", props.todoItems);
  return (
    <div>{props.todoItems.map(todoItem => <div>{todoItem.name}</div>)}</div>
  );
};
