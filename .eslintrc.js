module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb", "plugin:prettier/recommended"],
  plugins: ["prettier", "cypress", "graphql-next"],
  env: {
    browser: true
  },
  rules: {
    "prettier/prettier": "error",
    "import/prefer-default-export": 0,
    "graphql-next/template-strings": ["error"],
    "react/jsx-filename-extension": 0,
    "react/prefer-stateless-function": 1,
  }
};
