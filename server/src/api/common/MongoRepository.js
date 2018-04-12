/* eslint-disable global-require,prefer-destructuring, import/no-mutable-exports */
let MongoRepository;
let dbConnector;

if (process.env.BABEL_ENV === "test") {
  const tingo = require("./TingoRepository");
  MongoRepository = tingo.TingoRepository;
} else {
  const real = require("./RealMongoRepository");
  MongoRepository = real.RealMongoRepository;
  dbConnector = real.dbConnector;
}
export { MongoRepository, dbConnector };
