const browserify = require("browserify-preprocessor-babel7");

module.exports = on => {
  const options = browserify.defaultOptions;
  options.browserifyOptions.transform[1][1].babelrc = true;

  on("file:preprocessor", browserify(options));
};
