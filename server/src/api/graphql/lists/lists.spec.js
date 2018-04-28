/* eslint-env jest */
import gql from "graphql-tag";
import gqlClient from "todos-apollo-testing/testing/common/gqlClient";
import getListsWithDefaults from "todos-apollo-testing/testing/common/getListsWithDefaults";
import "todos-apollo-testing/testing/common/customJestMatcher";
import listsResolvers from "./listsResolvers";

test("returns all lists", async () => {
  const listsRepository = await getListsWithDefaults();

  const result = await gqlClient({
    context: { listsRepository },
    resolvers: [listsResolvers]
  }).query({
    query: gql`
      query {
        Lists {
          _id
          name
          incompleteCount
        }
      }
    `
  });

  const { Lists } = result.data;
  expect(Lists[0]).toMatchObject({
    _id: "firstId",
    name: "first list",
    incompleteCount: 0
  });
  expect(Lists[1]).toMatchObject({
    _id: "secondId",
    name: "second list",
    incompleteCount: 4
  });
});

test("adds a new list", async () => {
  const listsRepository = await getListsWithDefaults();

  const result = await gqlClient({
    context: { listsRepository },
    resolvers: [listsResolvers]
  }).mutate({
    mutation: gql`
      mutation AddList($ListName: String!) {
        AddList(ListName: $ListName) {
          name
        }
      }
    `,
    variables: { ListName: "My beautiful list" }
  });

  const { AddList } = result.data;

  expect(AddList).toMatchObject({ name: "My beautiful list" });

  const queryResult = await gqlClient({
    context: { listsRepository },
    resolvers: [listsResolvers]
  }).query({
    query: gql`
      query {
        Lists {
          _id
          name
          incompleteCount
        }
      }
    `
  });

  const { Lists } = queryResult.data;

  expect(Lists).toContainObject({
    name: "My beautiful list",
    incompleteCount: 0
  });
});
