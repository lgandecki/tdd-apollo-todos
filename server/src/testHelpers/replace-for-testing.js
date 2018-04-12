// We are automatically replacing the Base Repository Class to use Tingo instead of MongoDB
module.exports = function replaceImport(originalPath) {
  if (originalPath.indexOf("MongoRepository") !== -1) {
    return originalPath.replace("MongoRepository", "TingoRepository");
  }
  return originalPath;
};
