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
  await listsRepository.listsCollection.insert({
    _id: "privateList",
    name: "private list",
    incompleteCount: 0,
    userId: "preExistingUserId"
  });
  await listsRepository.listsCollection.insert({
    _id: "hiddenList",
    name: "hidden list",
    incompleteCount: 0,
    userId: "notUsedUserId"
  });
  return listsRepository;
}
