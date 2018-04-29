import { TodoItemsRepository } from "../../server/src/api/graphql/todoItems/TodoItemsRepository";

export default async function getTodoItemsWithDefaults() {
  const todoItemsRepository = new TodoItemsRepository();
  await todoItemsRepository.todoItemsCollection.insert({
    _id: "todoInFirstId",
    listId: "firstId",
    text: "todo in the first list",
    checked: false
  });
  await todoItemsRepository.todoItemsCollection.insert({
    _id: "firstTodoId",
    listId: "secondId",
    text: "first todo in the first list",
    checked: true
  });
  await todoItemsRepository.todoItemsCollection.insert({
    _id: "secondTodoId",
    listId: "secondId",
    text: "todo in the second list",
    checked: false
  });
  return todoItemsRepository;
}
