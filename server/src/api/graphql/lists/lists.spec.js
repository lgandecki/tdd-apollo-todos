/* eslint-env jest */
import gql from "graphql-tag";
import gqlClient from "todos-apollo-testing/testing/common/gqlClient";
import getListsWithDefaults from "todos-apollo-testing/testing/common/getListsWithDefaults";
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
