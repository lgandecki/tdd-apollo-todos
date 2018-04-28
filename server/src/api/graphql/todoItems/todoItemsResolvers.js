export default {
  Query: {
    TodoItems: (_, input, context) =>
      context.todoItemsRepository.getItemsFor(input)
  }
};
