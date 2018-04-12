// eslint-disable-next-line import/no-extraneous-dependencies
const collection = require("tingodb-promise");

export class TingoRepository {
  constructor() {
    this.db = { collection };
    this.init();
  }
  // eslint-disable-next-line class-methods-use-this
  init() {
    throw Error("Not yet implemented");
  }
}
