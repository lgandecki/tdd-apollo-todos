/* eslint-env jest */
import gql from "graphql-tag";
import gqlClient from "todos-apollo-testing/testing/common/gqlClient";
import getTodoItemsWithDefaults from "todos-apollo-testing/testing/common/getTodoItemsWithDefaults";
import "todos-apollo-testing/testing/common/customJestMatcher";
import todoItemsResolvers from "./todoItemsResolvers";

test("returns todo items for a given list", async () => {
  const todoItemsRepository = await getTodoItemsWithDefaults();

  const query = gql`
    query TodoItems($ListId: ID!) {
      TodoItems(ListId: $ListId) {
        _id
        text
        checked
      }
    }
  `;
  const result = await gqlClient({
    context: { todoItemsRepository },
    resolvers: [todoItemsResolvers]
  }).query({
    query,
    variables: { ListId: "secondId" }
  });

  const { TodoItems } = result.data;

  expect(TodoItems).toContainObject({
    _id: "firstTodoId",
    text: "first todo in the first list",
    checked: true
  });
});
