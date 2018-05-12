/* eslint-disable global-require */
// eslint-disable-next-line import/no-mutable-exports
let MsSQLRepository;

if (process.env.BABEL_ENV === "test") {
  const mockSql = require("./MockSQLRepository");
  MsSQLRepository = mockSql.MockSQLRepository;
} else {
  const real = require("./RealMsSQLRepository");
  MsSQLRepository = real.RealMsSQLRepository;
  // sqlDbConnector = real.dbConnector;
}
export { MsSQLRepository };
