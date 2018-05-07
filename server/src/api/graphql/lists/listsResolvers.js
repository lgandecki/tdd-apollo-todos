export default {
  Query: {
    Lists: (_, input, context) =>
      context.listsRepository.getLists({ user: context.user })
  },
  Mutation: {
    AddList: (_, input, context) => context.listsRepository.addList(input),
    RemoveList: (_, { listId }, context) =>
      context.listsRepository.removeList({ user: context.user, listId }),
    ChangeListName: (_, { listId, newName }, context) =>
      context.listsRepository.changeListName({
        listId,
        newName,
        user: context.user
      }),
    ToggleListPrivacy: (_, { listId }, context) =>
      context.listsRepository.toggleListPrivacy({
        _id: listId,
        userId: context.user._id
      })
  }
};
