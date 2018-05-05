import getListsWithDefaults from "./getListsWithDefaults";
import { dbConnector } from "../../server/src/api/common/MongoRepository";

export const createDefaultDb = async () => {
  const db = await dbConnector();
  await db.dropDatabase();
  await getListsWithDefaults();
};
