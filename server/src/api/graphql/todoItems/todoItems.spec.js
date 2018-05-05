/* eslint-env jest */
import gql from "graphql-tag";
import gqlClient from "todos-apollo-testing/testing/common/gqlClient";
import getTodoItemsWithDefaults from "todos-apollo-testing/testing/common/getTodoItemsWithDefaults";
import "todos-apollo-testing/testing/common/customJestMatcher";
import todoItemsResolvers from "./todoItemsResolvers";

test("returns todo items for a given list", async () => {
  const todoItemsRepository = await getTodoItemsWithDefaults();

  const query = gql`
    query TodoItems($listId: ID!) {
      TodoItems(listId: $listId) {
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
    variables: { listId: "secondId" }
  });

  const { TodoItems } = result.data;

  expect(TodoItems).toContainObject({
    _id: "firstTodoId",
    text: "first todo in the second list",
    checked: true
  });
});

test("add a new todo and rename it", async () => {});
