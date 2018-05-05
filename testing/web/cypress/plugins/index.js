const browserify = require("@cypress/browserify-preprocessor");

module.exports = on => {
  const options = browserify.defaultOptions;
  options.browserifyOptions.transform[1][1].babelrc = true;

  on("file:preprocessor", browserify(options));
};
