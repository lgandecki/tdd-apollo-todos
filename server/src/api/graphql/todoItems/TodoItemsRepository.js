import MongoClient from "mongodb";
import { MongoRepository } from "../../common/MongoRepository";

export class TodoItemsRepository extends MongoRepository {
  init() {
    this.todoItemsCollection = this.db.collection("todoItems");
  }

  getItemsFor({ listId }) {
    return this.todoItemsCollection.find({ listId }).toArray();
  }

  removeItem({ itemId }) {
    return this.todoItemsCollection.remove({ _id: itemId });
  }

  async addTodo({ text, listId }) {
    const returned = await this.todoItemsCollection.insert({
      _id: new MongoClient.ObjectId().toString(),
      text,
      listId,
      checked: false
    });
    return returned.ops[0];
  }

  // THIS IS APOLLO-SERVER BACKEND! :-)
  // THIS IS APOLLO-SERVER BACKEND! :-)
  // THIS IS APOLLO-SERVER BACKEND! :-)
  // THIS IS APOLLO-SERVER BACKEND! :-)

  async toggleTodoCheck({ itemId, checked }) {
    await this.todoItemsCollection.update(
      {
        _id: itemId
      },
      { $set: { checked } }
    );
    return { _id: itemId, checked };
  }

  async renameTodo({ todoId, newText }) {
    await this.todoItemsCollection.update(
      { _id: todoId },
      { $set: { text: newText } }
    );
    return { _id: todoId, text: newText };
  }
}

export const todoItemsRepository = new TodoItemsRepository();
