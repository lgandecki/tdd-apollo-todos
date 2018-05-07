process.env.BABEL_ENV = "test";

module.exports = wallaby => ({
  debug: true,
  testFramework: "jest",
  files: [
    "server/src/**/*.js",
    "server/src/**/*.graphql",
    "server/package.json",
    "server/testHelpers/**/*.js",
    "server/jest.config.js",
    { pattern: "server/src/**/*.spec.js", ignore: true },
    "testing/common/**/*.js"
  ],
  tests: ["server/src/**/*.spec.js"],
  compilers: { "**/*.js": wallaby.compilers.babel() },
  env: { type: "node" },
  setup() {
    // eslint-disable-next-line global-require
    const jestConfig = require("./server/jest.config");
    delete jestConfig.rootDir;
    jestConfig.moduleDirectories = [
      "node_modules",
      "<rootDir>/server/node_modules"
    ];
    wallaby.testFramework.configure(jestConfig);
  }
});

