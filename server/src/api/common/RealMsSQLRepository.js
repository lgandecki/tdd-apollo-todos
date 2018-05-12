const Sequelize = require("sequelize");

let host;
let sequelize;

switch (process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase()) {
  case "PRODUCTION":
    host = process.env.SQLURL;
    break;
  case "DEVELOPMENT":
  default:
    host = "localhost";
    break;
}

function dbConnector() {
  sequelize = new Sequelize("todos", "SA", "MyStrongPassword123", {
    host,
    dialect: "mssql",

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
  });
  //
  // dbClient = await MongoClient.connect(dbURI).catch(e => {
  //   throw new Error(`error connecting to db ${e}`);
  // });
  // dbInstance = dbClient.db("todosApollo");
  // collectionInitQueue.forEach(collectionInitCallback =>
  //   collectionInitCallback()
  // );
  return sequelize;
}

export class RealMsSQLRepository {
  constructor() {
    if (!sequelize) {
      dbConnector();
    }
    this.sequelize = sequelize;
    this.init();
  }
  // eslint-disable-next-line class-methods-use-this
  init() {
    throw Error("Not yet implemented");
  }
}
