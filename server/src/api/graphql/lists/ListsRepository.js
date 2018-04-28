import { MongoRepository } from "../../common/MongoRepository";

export class ListsRepository extends MongoRepository {
  init() {
    this.listsCollection = this.db.collection("courses");
  }

  getLists() {
    return this.listsCollection.find().toArray();
  }

  async addList({ ListName: name }) {
    const newList = { name, incompleteCount: 0 };
    await this.listsCollection.insert(newList);
    return newList;
  }

  async removeList({ ListName: name }) {
    await this.listsCollection.remove({ name });
    return name;
  }
}

export const listsRepository = new ListsRepository();
