import MongoClient from "mongodb";
import { MongoRepository } from "../../common/MongoRepository";

export class ListsRepository extends MongoRepository {
  init() {
    this.listsCollection = this.db.collection("courses");
  }

  getLists() {
    return this.listsCollection.find().toArray();
  }

  async addList({ listName: name }) {
    const newList = {
      _id: new MongoClient.ObjectId().toString(),
      name,
      incompleteCount: 0
    };
    await this.listsCollection.insert(newList);
    return newList;
  }

  async removeList({ listId: _id }) {
    await this.listsCollection.remove({ _id });
    return _id;
  }

  async changeListName({ listId: _id, newName: name }) {
    await this.listsCollection.update({ _id }, { $set: { name } });
    return this.listsCollection.findOne({ _id });
  }
}

export const listsRepository = new ListsRepository();
