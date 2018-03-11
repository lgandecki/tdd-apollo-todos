/* eslint-env jest */
import gql from "graphql-tag";
import gqlClient from "../../../testHelpers/gqlClient";
import { dbConnector, dbClient } from "../../repositories/MongoRepository";
import { listsRepository } from "../../repositories/ListsRepository";
import getListsWithDefaults from "../../../../../testing/common/getListsWithDefaults";

let dbInstance;
beforeEach(async () => {
  dbInstance = await dbConnector();
  await dbInstance.dropDatabase();
  await getListsWithDefaults();
});

afterEach(async () => {
  await dbClient.close();
});

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
  await listsRepository.db;
});
