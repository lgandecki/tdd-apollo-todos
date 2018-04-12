import { ListsRepository } from "../../server/src/api/graphql/lists/ListsRepository";

export default async function getListsWithDefaults() {
  const listsRepository = new ListsRepository();
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
  return listsRepository;
}

