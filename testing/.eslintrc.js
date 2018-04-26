const eslintrc = require("../.eslintrc");

module.exports = {
  ...eslintrc,
  rules: {
    ...eslintrc.rules,
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 0,
    "import/extensions": 0
  }
};
