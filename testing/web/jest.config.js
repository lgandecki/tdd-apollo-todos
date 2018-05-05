module.exports = {
  rootDir: "../../",
  displayName: "real web integration",
  moduleNameMapper: {
    "\\.(css|less|svg)$": "<rootDir>/testing/fileMock.js"
  },
  moduleDirectories: [
    "node_modules",
    "<rootDir>/server/node_modules",
    "<rootDir>/web/node_modules"
  ],
  testMatch: ["<rootDir>/testing/web/**/*.spec.js"],
  testURL: "http://localhost",
  testEnvironment: "jsdom"
};
