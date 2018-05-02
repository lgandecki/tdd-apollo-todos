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
      text,
      listId,
      checked: false
    });
    return returned.ops[0];
  }

  async toggleTodoCheck({ itemId, checked }) {
    await this.todoItemsCollection.update(
      {
        _id: itemId
      },
      { $set: { checked } }
    );
    return { _id: itemId, checked };
  }
}

export const todoItemsRepository = new TodoItemsRepository();
