import getListsWithDefaults from "./getListsWithDefaults";
import { dbConnector } from "../../server/src/api/common/MongoRepository";

const createDefaultDb = async () => {
  const db = await dbConnector();
  await db.dropDatabase();
  await getListsWithDefaults();
};

createDefaultDb()
  .then(() => {
    console.log("done!");
    process.exit(0);
  })
  .catch(e => {
    console.log("Error", e);
    process.exit(1);
  });
