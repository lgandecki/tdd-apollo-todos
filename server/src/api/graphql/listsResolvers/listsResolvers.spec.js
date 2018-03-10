/* eslint-env jest */
import { mockNetworkInterfaceWithSchema } from "apollo-test-utils-with-context";
import gql from "graphql-tag";
import schema from "./schema";

test("returns all lists", async () => {
  const result = await mockNetworkInterfaceWithSchema({
    schema
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

  const lists = result.data.Lists;
  expect(lists[0]).toEqual({
    _id: "firstId",
    name: "first list",
    incompleteCount: 0
  });
  expect(lists[1]).toEqual({
    _id: "secondId",
    name: "second list",
    incompleteCount: 4
  });
});
