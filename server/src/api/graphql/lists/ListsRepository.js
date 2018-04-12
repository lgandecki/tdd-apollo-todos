import { MongoRepository } from "../../common/MongoRepository";

export class ListsRepository extends MongoRepository {
  init() {
    this.listsCollection = this.db.collection("courses");
  }

  async getLists() {
    const data = await this.listsCollection.find().toArray();
    console.log("Gandecki data", data);

    return this.listsCollection.find().toArray();
  }
}

export const listsRepository = new ListsRepository();
