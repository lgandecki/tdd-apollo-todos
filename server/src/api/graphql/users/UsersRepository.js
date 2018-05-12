import MongoClient from "mongodb";
import bcrypt from "bcryptjs";
import { MongoRepository } from "../../common/MongoRepository";

export class UsersRepository extends MongoRepository {
  init() {
    this.usersCollection = this.db.collection("users");
  }

  async createUser({ email, password }) {
    const SALT_WORK_FACTOR = 10;
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    const newUser = {
      _id: new MongoClient.ObjectId().toString(),
      email,
      password: hash
    };

    const insertedUser = await this.usersCollection.insert(newUser);
    return insertedUser.ops[0];
  }
  async findByUsernameAndPassword({ email, password }) {
    const user = await this.usersCollection.findOne({ email });
    if (await bcrypt.compare(password, user.password)) {
      return user;
    }
    return undefined;
  }
}

export const usersRepository = new UsersRepository();
