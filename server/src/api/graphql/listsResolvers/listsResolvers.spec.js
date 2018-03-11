/* eslint-env jest */
import gql from "graphql-tag";
import gqlClient from "../../../testHelpers/gqlClient";
import { dbConnector } from "../../repositories/MongoRepository";
import { listsRepository } from "../../repositories/ListsRepository";

test("returns all lists", async () => {
  await dbConnector();
  await listsRepository.listsCollection.drop();
  await listsRepository.listsCollection.insert({
    _id: "firstId",
    name: "first list",
    incompleteCount: 0
  });
  await listsRepository.listsCollection.insert({
    _id: "secondId",
    name: "second list",
    incompleteCount: 4
  });
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
