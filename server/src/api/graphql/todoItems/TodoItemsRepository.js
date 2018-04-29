import { MongoRepository } from "../../common/MongoRepository";

export class TodoItemsRepository extends MongoRepository {
  init() {
    this.todoItemsCollection = this.db.collection("todoItems");
  }

  getItemsFor({ ListId }) {
    return this.todoItemsCollection.find({ listId: ListId }).toArray();
  }

  removeItem({ ItemId }) {
    return this.todoItemsCollection.remove({ _id: ItemId });
  }
}

export const todoItemsRepository = new TodoItemsRepository();
