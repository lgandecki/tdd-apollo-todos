module.exports = {
  rootDir: "../../",
  displayName: "mobile real integration",
  haste: {
    defaultPlatform: "ios",
    platforms: ["android", "ios", "native"],
    providesModuleNodeModules: ["react-native"]
  },
  testMatch: ["<rootDir>/testing/mobile/integration/**/*.test.js"],
  moduleNameMapper: {
    "^[./a-zA-Z0-9$_-]+\\.(bmp|gif|jpg|jpeg|png|psd|svg|webp)$":
      "RelativeImageStub",
    "^React$": "<rootDir>/mobile/node_modules/react",
    "^react$": "<rootDir>/mobile/node_modules/react",
    "^react-native$": "<rootDir>/mobile/node_modules/react-native",
    "^react-apollo$": "<rootDir>/mobile/node_modules/react-apollo",
    "^react-native/(.*)$": "<rootDir>/mobile/node_modules/react-native/$1",
    "^[./a-zA-Z0-9$_-]+\\.(ttf|otf|m4v|mov|mp4|mpeg|mpg|webm|aac|aiff|caf|m4a|mp3|wav|html|pdf|obj)$":
      "RelativeImageStub"
  },
  modulePathIgnorePatterns: [
    "<rootDir>/mobile/node_modules/react-native/Libraries/react-native/"
  ],
  transformIgnorePatterns: [
    "<rootDir>/server/node_modules/",
    "<rootDir>/web/node_modules/",
    "<rootDir>/node_modules/",
    "<rootDir>/mobile/node_modules/(?!react-apollo|react-native|expo|react-router-native)"
  ],
  setupFiles: [
    "<rootDir>/mobile/node_modules/react-native/jest/setup.js",
    "<rootDir>/mobile/node_modules/jest-expo/src/setup.js",
    "<rootDir>/mobile/setup.js"
  ]
};
