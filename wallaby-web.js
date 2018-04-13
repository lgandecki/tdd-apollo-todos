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
    "testing/common/**/*.js"
  ],
  tests: ["testing/web/integration/*.spec.js"],
  compilers: { "**/*.js": wallaby.compilers.babel() },
  env: { type: "node" },
  setup(wallaby) {
    const jestConfig = require("./testing/web/jest.config");
    delete jestConfig.rootDir;
    jestConfig.moduleDirectories = [
      "node_modules",
      "<rootDir>/server/node_modules",
      "<rootDir>/web/node_modules"
    ];
    wallaby.testFramework.configure(jestConfig);
  }
});
