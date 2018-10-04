/* eslint-disable import/no-extraneous-dependencies */
const browserify = require("@cypress/browserify-preprocessor");
const watchApp = require("cypress-app-watcher-preprocessor");

module.exports = on => {
  const options = browserify.defaultOptions;
  options.browserifyOptions.transform[1][1].babelrc = true;

  on("file:preprocessor", watchApp(browserify(options)));
};
