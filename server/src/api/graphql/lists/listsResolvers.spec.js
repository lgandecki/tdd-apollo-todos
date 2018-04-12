/* eslint-env jest */
import gql from "graphql-tag";
import gqlClient from "../../../testHelpers/gqlClient";
import getListsWithDefaults from "../../../../../testing/common/getListsWithDefaults";

test("returns all lists", async () => {
  const listsRepository = await getListsWithDefaults();

  const result = await gqlClient({ listsRepository }).query({
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
