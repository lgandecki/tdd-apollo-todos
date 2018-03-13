import { MongoRepository } from "./MongoRepository";

export class ListsRepository extends MongoRepository {
  init() {
    this.listsCollection = this.db.collection("courses");
  }

  getLists() {
    return this.listsCollection.find().toArray();
  }
}

export const listsRepository = new ListsRepository();
