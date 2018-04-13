module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb", "plugin:prettier/recommended"],
  plugins: ["prettier", "graphql-next"],
  env: {
    browser: true
  },
  rules: {
    "react/jsx-filename-extension": 0,
    "react/prefer-stateless-function": 1,
    "graphql-next/template-strings": ["error"]
  }
};
