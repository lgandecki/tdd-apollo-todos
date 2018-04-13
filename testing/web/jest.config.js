module.exports = {
  rootDir: "../../",
  displayName: "real web integration",
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/testing/fileMock.js"
  },
  testMatch: ["<rootDir>/testing/web/**/*.spec.js"]
};
