import MongoClient from "mongodb";
// import bcrypt from "bcryptjs";
import { MongoRepository } from "../../common/MongoRepository";

export class UsersRepository extends MongoRepository {
  init() {
    this.usersCollection = this.db.collection("users");
  }

  async createUser({ email, password }) {
    const newUser = {
      _id: new MongoClient.ObjectId().toString(),
      email,
      password
    };

    const insertedUser = await this.usersCollection.insert(newUser);
    return insertedUser.ops[0];
  }
  findByUsernameAndPassword({ email, password }) {
    return this.usersCollection.findOne({ email, password });
  }
}

export const usersRepository = new UsersRepository();
