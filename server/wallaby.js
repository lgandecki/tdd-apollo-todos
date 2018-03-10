process.env.BABEL_ENV = "serverTest";

module.exports = wallaby => ({
  debug: true,
  testFramework: "jest",
  files: [
    "src/**/*.js",
    "package.json",
    "testHelpers/**/*.js",
    { pattern: "src/**/*.spec.js", ignore: true }
  ],
  tests: ["src/**/*.spec.js"],
  compilers: { "**/*.js": wallaby.compilers.babel() },
  env: { type: "node" }
});
