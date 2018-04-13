
var path = require('path');
var blacklist;
try {
  blacklist = require('metro-bundler/src/blacklist');
} catch(e) {
  blacklist = require('metro/src/blacklist');
}

var config = {
  extraNodeModules: {
    'react-native': path.resolve(__dirname, 'node_modules/react-native')
  },
  getBlacklistRE() {
    return blacklist([
      /[/\\]Users[/\\]lukaszgandecki[/\\]projects[/\\]todos-apollo[/\\]shared[/\\]node_modules[/\\]react-native[/\\].*/
    ]);
  },
  getProjectRoots() {
    return [
      // Keep your project directory.
      path.resolve(__dirname),

      // Include your forked package as a new root.
      path.resolve('/Users/lukaszgandecki/projects/todos-apollo/shared')
    ];
  }
};
module.exports = config;
  