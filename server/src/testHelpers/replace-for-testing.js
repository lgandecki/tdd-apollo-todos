module.exports = function replaceImport(originalPath, sourcePath) {
  if (
    originalPath.indexOf("graphql-tools") !== -1 &&
    sourcePath.indexOf("node_modules") === -1
  ) {
    const newPath = originalPath.replace(
      "graphql-tools",
      `apollo-test-utils-with-context`
    );
    return newPath;
  }
  return originalPath;
};
