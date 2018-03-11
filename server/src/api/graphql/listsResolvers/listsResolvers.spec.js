/* eslint-env jest */
import gql from "graphql-tag";
import gqlClient from "../../../testHelpers/gqlClient";

test("returns all lists", async () => {
  const result = await gqlClient().query({
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

  const lists = result.data.Lists;
  expect(lists[0]).toMatchObject({
    _id: "firstId",
    name: "first list",
    incompleteCount: 0
  });
  expect(lists[1]).toMatchObject({
    _id: "secondId",
    name: "second list",
    incompleteCount: 4
  });
});
