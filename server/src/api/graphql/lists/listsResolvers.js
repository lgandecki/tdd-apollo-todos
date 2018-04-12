export default {
  Query: {
    Lists: (_, input, context) => context.listsRepository.getLists()
  }
};
