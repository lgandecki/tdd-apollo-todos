module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb", "plugin:prettier/recommended", "plugin:jest/recommended"],
  plugins: ["prettier", "cypress", "graphql-next", "jest"],
  env: {
    browser: true
  },
  rules: {
    "prettier/prettier": "error",
    "import/prefer-default-export": 0,
    "graphql-next/template-strings": ["error"],
    "react/jsx-filename-extension": 0,
    "react/prefer-stateless-function": 1,
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    // "jsx-a11y/anchor-is-valid": [
    //   "error",
    //   {
    //     components: ["Link"],
    //     specialLink: ["to"]
    //   }
    // ],
    // The original meteor code didn't get this right, so I'm not gonna fight it here as
    // that's not the point of this demo :)
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/label-has-for": 0,
    "jest/no-hooks": 2,
    "jest/no-test-prefixes": 2,
    "jest/prefer-to-be-null": 2,
    "jest/prefer-to-be-undefined": 2,
    "jest/valid-expect": 2,
    "jest/valid-expect-in-promise": 2,
    "no-underscore-dangle": 0,
    "react/forbid-prop-types": 0, // temporary
    "class-methods-use-this": 0
  }
};
