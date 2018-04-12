/* eslint-disable global-require */
// eslint-disable-next-line import/no-mutable-exports
let MongoRepository;
if (process.env.BABEL_ENV === "test") {
  MongoRepository = require("./TingoRepository").TingoRepository;
} else {
  MongoRepository = require("./RealMongoRepository").RealMongoRepository;
}
export { MongoRepository };
