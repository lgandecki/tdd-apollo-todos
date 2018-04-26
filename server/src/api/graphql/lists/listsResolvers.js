export default {
  Query: {
    Lists: (_, input, context) => context.listsRepository.getLists()
  },
  Mutation: {
    AddList: (_, input, context) => context.listsRepository.addList(input),
    RemoveList: (_, input, context) => context.listsRepository.removeList(input)
  }
};
