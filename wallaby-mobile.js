module.exports = wallaby => ({
  testFramework: "jest",
  files: [
    "mobile/**/*.js",
    "!mobile/node_modules/**",
    "server/src/**/*.js",
    "server/src/**/*.graphql",
    "!server/src/**/*.spec.js",
    "testing/common/**/*.js",
    "testing/mobile/jest.config.js",
    "testing/mobile/**/*.js",
    "!shared/node_modules/**/*.js",
    { pattern: "testing/mobile/**/*.test.js", ignore: true },
    { pattern: "testing/mobile/e2e/**/*.js", ignore: true }
  ],
  tests: ["testing/mobile/integration/**/*.test.js"],
  compilers: { "**/*.js": wallaby.compilers.babel() },
  env: { type: "node" },
  setup() {
    // eslint-disable-next-line global-require
    const jestConfig = require("./testing/mobile/jest.config");
    delete jestConfig.rootDir;
    jestConfig.moduleDirectories = [
      "node_modules",
      "<rootDir>/server/node_modules",
      "<rootDir>/mobile/node_modules"
    ];
    wallaby.testFramework.configure(jestConfig);
  }
});
