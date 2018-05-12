module.exports = wallaby => ({
  testFramework: "jest",
  files: [
    "web/src/**/*.js",
    "!web/src/**/*.test.js",
    "server/src/**/*.js",
    "server/src/**/*.graphql",
    "!server/src/**/*.spec.js",
    "testing/web/jest.config.js",
    "testing/web/integration/**/*.js",
    "!testing/web/integration/**/*.spec.js",
    "testing/fileMock.js",
    "testing/common/**/*.js",
    "babel.config.js"
  ],
  tests: ["testing/web/integration/*.spec.js"],
  compilers: { "**/*.js": wallaby.compilers.babel() },
  env: { type: "node" },
  setup() {
    // eslint-disable-next-line global-require
    const jestConfig = require("./testing/web/jest.config");
    delete jestConfig.rootDir;
    wallaby.testFramework.configure(jestConfig);
  }
});
