/* eslint-env jest */
import gql from "graphql-tag";
import gqlClient from "todos-apollo-testing/testing/common/gqlClient";
import getListsWithDefaults from "todos-apollo-testing/testing/common/getListsWithDefaults";
import "todos-apollo-testing/testing/common/customJestMatcher";
import listsResolvers from "./listsResolvers";

const getAllLists = async listsRepository => {
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
  return Lists;
};

test("returns all lists", async () => {
  const listsRepository = await getListsWithDefaults();

  const Lists = await getAllLists(listsRepository);

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

const addList = async (listName, listsRepository) => {
  const result = await gqlClient({
    context: { listsRepository },
    resolvers: [listsResolvers]
  }).mutate({
    mutation: gql`
      mutation($listName: String!) {
        AddList(listName: $listName) {
          name
          _id
        }
      }
    `,
    variables: { listName }
  });

  return result.data;
};

test("adds a new list", async () => {
  const listsRepository = await getListsWithDefaults();

  const { AddList } = await addList("My beautiful list", listsRepository);

  expect(AddList).toMatchObject({ name: "My beautiful list" });

  const Lists = await getAllLists(listsRepository);

  expect(Lists).toContainObject({
    name: "My beautiful list",
    incompleteCount: 0
  });
});

test("Can remove added list", async () => {
  const listsRepository = await getListsWithDefaults();

  const { AddList: { _id } } = await addList(
    "My beautiful list",
    listsRepository
  );

  await gqlClient({
    context: { listsRepository },
    resolvers: [listsResolvers]
  }).mutate({
    mutation: gql`
      mutation RemoveList($listId: ID!) {
        RemoveList(listId: $listId)
      }
    `,
    variables: { listId: _id }
  });

  const Lists = await getAllLists(listsRepository);

  expect(Lists).not.toContainObject({
    name: "My beautiful list",
    incompleteCount: 0
  });
});
