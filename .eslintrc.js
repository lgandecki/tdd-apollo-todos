module.exports = {
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  plugins: ["prettier", "cypress", "graphql-next"],
  rules: {
    "prettier/prettier": "error",
    "import/prefer-default-export": 0,
    "graphql-next/template-strings": ["error"]
  }
};
