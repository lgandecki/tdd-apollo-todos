import { TodoItemsRepository } from "../../server/src/api/graphql/todoItems/TodoItemsRepository";

export default async function getTodoItemsWithDefaults() {
  const todoItemsRepository = new TodoItemsRepository();
  await todoItemsRepository.init();
  await todoItemsRepository.TodoItem.create({
    listId: "firstId",
    text: "first todo in the first list",
    checked: false
  });
  await todoItemsRepository.TodoItem.create({
    listId: "secondId",
    text: "first todo in the second list",
    checked: true
  });
  await todoItemsRepository.TodoItem.create({
    listId: "secondId",
    text: "second todo in the second list",
    checked: false
  });
  return todoItemsRepository;
}
