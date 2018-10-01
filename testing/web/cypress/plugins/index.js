const browserify = require("browserify-preprocessor-babel7");
const watchApp = require("cypress-app-watcher-preprocessor");

module.exports = on => {
  const options = browserify.defaultOptions;
  options.browserifyOptions.transform[1][1].babelrc = true;

  on("file:preprocessor", watchApp(browserify(options)));
};
