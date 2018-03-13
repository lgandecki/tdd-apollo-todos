import * as MongoClient from "mongodb";

let dbInstance = null;
// eslint-disable-next-line import/no-mutable-exports
let dbClient = null; // this is for testing purposes as we don't have a different way to close connection
let dbURI;
const collectionInitQueue = [];

switch (process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase()) {
  case "PRODUCTION":
    dbURI = process.env.MONGOURL;
    break;
  case "DEVELOPMENT":
  default:
    dbURI = "mongodb://localhost/";
    break;
}

export async function dbConnector() {
  dbClient = await MongoClient.connect(dbURI).catch(e => {
    throw new Error(`error connecting to db ${e}`);
  });
  dbInstance = dbClient.db("todosApollo");
  collectionInitQueue.forEach(collectionInitCallback =>
    collectionInitCallback()
  );
  return dbInstance;
}

export { dbClient };

export class MongoRepository {
  constructor() {
    if (dbInstance) {
      this.db = dbInstance;
      this.init();
    } else {
      collectionInitQueue.push(() => {
        this.db = dbInstance;
        this.init();
      });
    }
  }

  static init() {
    throw Error("Not yet implemented");
  }
}
