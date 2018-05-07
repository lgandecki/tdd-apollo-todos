/* eslint-env jest */
import gql from "graphql-tag";
import gqlClient from "todos-apollo-testing/testing/common/gqlClient";
import getListsWithDefaults from "todos-apollo-testing/testing/common/getListsWithDefaults";
import "todos-apollo-testing/testing/common/customJestMatcher";
import listsResolvers from "./listsResolvers";

const getAllLists = async (listsRepository, passedContext) => {
  const result = await gqlClient({
    context: { listsRepository, ...passedContext },
    resolvers: [listsResolvers]
  }).query({
    query: gql`
      query {
        Lists {
          _id
          name
          incompleteCount
          userId
        }
      }
    `
  });

  const { Lists } = result.data;
  return Lists;
};

test("returns all lists without private lists of other users", async () => {
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
  expect(Lists).not.toContainObject({
    name: "private list"
  });
});

test("returns all lists including my private ones", async () => {
  const listsRepository = await getListsWithDefaults();

  const context = { user: { _id: "preExistingUserId" } };
  const Lists = await getAllLists(listsRepository, context);

  expect(Lists).toContainObject({
    userId: "preExistingUserId"
  });
  expect(Lists).not.toContainObject({
    userId: "notUsedUserId"
  });
  expect(Lists).toContainObject({
    _id: "firstId",
    name: "first list",
    incompleteCount: 0
  });
  expect(Lists).toContainObject({
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

describe("Removing list", () => {
  const removeList = async (listId, listsRepository, passedContext) => {
    await gqlClient({
      context: { listsRepository, ...passedContext },
      resolvers: [listsResolvers]
    }).mutate({
      mutation: gql`
        mutation($listId: ID!) {
          RemoveList(listId: $listId)
        }
      `,
      variables: { listId }
    });

    return getAllLists(listsRepository, passedContext);
  };

  test("Can remove public list", async () => {
    const listsRepository = await getListsWithDefaults();

    const { AddList: { _id } } = await addList(
      "My beautiful list",
      listsRepository
    );

    const Lists = await removeList(_id, listsRepository);

    expect(Lists).not.toContainObject({
      name: "My beautiful list",
      incompleteCount: 0
    });
  });

  test("Can't remove someone elses list", async () => {
    const listsRepository = await getListsWithDefaults();
    const _id = "hiddenList";

    await removeList(_id, listsRepository);

    const list = await listsRepository.listsCollection.findOne({ _id });
    expect(list._id).toEqual(_id);
  });

  test("Can remove my own list", async () => {
    const listsRepository = await getListsWithDefaults();
    const _id = "privateList";

    const context = { user: { _id: "preExistingUserId" } };

    const Lists = await removeList(_id, listsRepository, context);

    expect(Lists).not.toContainObject({
      _id
    });
  });
});

describe("List Privacy", () => {
  const togglePrivacy = async ({ listId, userId, listsRepository }) => {
    await gqlClient({
      context: { listsRepository, user: { _id: userId } },
      resolvers: [listsResolvers]
    }).mutate({
      mutation: gql`
        mutation($listId: ID!) {
          ToggleListPrivacy(listId: $listId) {
            userId
          }
        }
      `,
      variables: { listId }
    });

    return getAllLists(listsRepository, { user: { _id: userId } });
  };
  test("Switches from public to private", async () => {
    const listsRepository = await getListsWithDefaults();

    const listId = "firstId";
    const userId = "userId";

    const Lists = await togglePrivacy({ listId, userId, listsRepository });

    expect(Lists).toContainObject({
      _id: listId,
      userId
    });
  });
  test("Doesn't switch if list doesn't belong to you", async () => {
    const listsRepository = await getListsWithDefaults();

    const listId = "firstId";
    const userId = "userId";

    await listsRepository.listsCollection.update(
      { _id: listId },
      { $set: { userId: "otherUser" } }
    );

    const Lists = await togglePrivacy({ listId, userId, listsRepository });

    expect(Lists).not.toContainObject({
      _id: listId,
      userId
    });
  });
  test("Switches from private to public", async () => {
    const listsRepository = await getListsWithDefaults();

    const listId = "firstId";
    const userId = "userId";

    await listsRepository.listsCollection.update(
      { _id: listId },
      { $set: { userId } }
    );

    const Lists = await togglePrivacy({ listId, userId, listsRepository });

    expect(Lists).not.toContainObject({
      _id: listId,
      userId
    });
  });
});

describe("Changing name", () => {
  const changeName = async (listId, newName, user) => {
    const listsRepository = await getListsWithDefaults();
    await gqlClient({
      context: { listsRepository, user },
      resolvers: [listsResolvers]
    }).mutate({
      mutation: gql`
        mutation($listId: ID!, $newName: String!) {
          ChangeListName(listId: $listId, newName: $newName) {
            _id
          }
        }
      `,
      variables: {
        listId,
        newName
      }
    });
    return {
      lists: await getAllLists(listsRepository, { user }),
      listsRepository
    };
  };
  it("works for my own list", async () => {
    const _id = "privateList";
    const { lists } = await changeName(_id, "new name", {
      _id: "preExistingUserId"
    });
    expect(lists).toContainObject({ name: "new name" });
  });
  it("works for public list", async () => {
    const _id = "firstId";
    const { lists } = await changeName(_id, "new name for firstId");
    expect(lists).toContainObject({ name: "new name for firstId" });
  });
  it("doesn't work for someone else's private list", async () => {
    const _id = "hiddenList";
    const { listsRepository } = await changeName(_id, "new name", {
      _id: "preExistingUserId"
    });
    const list = await listsRepository.listsCollection.findOne({
      name: "new name"
    });
    expect(list).toBeFalsy();
  });
});
