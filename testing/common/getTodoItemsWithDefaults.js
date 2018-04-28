import { TodoItemsRepository } from "../../server/src/api/graphql/todoItems/TodoItemsRepository";

export default async function getTodoItemsWithDefaults() {
  const todoItemsRepository = new TodoItemsRepository();
  await todoItemsRepository.todoItemsCollection.insert({
    _id: "firstTodoId",
    listId: "secondId",
    name: "todo in the first list",
    isCompleted: true
  });
  await todoItemsRepository.todoItemsCollection.insert({
    _id: "secondTodoId",
    listId: "secondId",
    name: "todo in the second list",
    isCompleted: false
  });
  return todoItemsRepository;
}
