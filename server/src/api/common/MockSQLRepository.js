const Sequelize = require("sequelize");

export class MockSQLRepository {
  constructor() {
    this.sequelize = new Sequelize("database", "username", "password", {
      dialect: "sqlite"
    });
    this.init();
  }
  // eslint-disable-next-line class-methods-use-this
  init() {
    throw Error("Not yet implemented");
  }
}
