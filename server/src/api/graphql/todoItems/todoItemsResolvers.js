export default {
  Query: {
    TodoItems: (_, input, context) =>
      context.todoItemsRepository.getItemsFor(input)
  },
  Mutation: {
    RemoveItem: (_, input, context) =>
      context.todoItemsRepository.removeItem(input)
  }
};
