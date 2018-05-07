import MongoClient from "mongodb";
import { MongoRepository } from "../../common/MongoRepository";

const getPermissionsQuery = user => {
  const permissionsQuery = { $or: [{ userId: { $exists: false } }] };
  if (user && user._id) {
    permissionsQuery.$or.push({ userId: user._id });
  }
  return permissionsQuery;
};
export class ListsRepository extends MongoRepository {
  init() {
    this.listsCollection = this.db.collection("courses");
  }

  getLists({ user }) {
    return this.listsCollection
      .find({ ...getPermissionsQuery(user) })
      .toArray();
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

  async removeList({ listId: _id, user }) {
    await this.listsCollection.remove({ _id, ...getPermissionsQuery(user) });
    return _id;
  }

  async changeListName({ listId: _id, newName: name, user }) {
    await this.listsCollection.update(
      { _id, ...getPermissionsQuery(user) },
      { $set: { name } }
    );
    return this.listsCollection.findOne({ _id });
  }

  async toggleListPrivacy({ _id, userId }) {
    const list = await this.listsCollection.findOne({ _id });
    if (list.userId === userId) {
      await this.listsCollection.update(
        { _id, userId },
        { $unset: { userId: "" } }
      );
    } else {
      await this.listsCollection.update(
        { _id, userId: { $exists: false } },
        { $set: { userId } }
      );
    }
    return this.listsCollection.findOne({ _id });
  }
}

export const listsRepository = new ListsRepository();
