/* eslint-disable react/prop-types */
import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ListPage from "../pages/ListPage";
import Loading from "../components/Loading";

export const showTodoItemsForList = gql`
  query TodoItems($ListId: ID!) {
    TodoItems(ListId: $ListId) {
      _id
      checked
      text
    }
  }
`;

export default ({ list }) => (
  <Query query={showTodoItemsForList} variables={{ ListId: list._id }}>
    {({ loading, data: { TodoItems } }) => {
      if (loading) {
        return <Loading key="loading" />;
      }
      return <ListPage todos={TodoItems} list={list} />;
    }}
  </Query>
);
