export default {
  Query: {
    TodoItems: (_, input, context) =>
      context.todoItemsRepository.getItemsFor(input)
  },
  Mutation: {
    RemoveItem: (_, input, { todoItemsRepository }) =>
      todoItemsRepository.removeItem(input),
    AddTodo: (_, { text, listId }, { todoItemsRepository }) =>
      todoItemsRepository.addTodo({ text, listId }),
    ToggleTodoCheck: (_, { itemId, checked }, { todoItemsRepository }) =>
      todoItemsRepository.toggleTodoCheck({ itemId, checked }),
    RenameTodo: (_, { todoId, newText }, { todoItemsRepository }) =>
      todoItemsRepository.renameTodo({ todoId, newText })
  }
};
