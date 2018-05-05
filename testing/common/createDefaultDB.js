/* eslint-disable no-console */
import { createDefaultDb } from "./createDefaultDbHelper";

createDefaultDb()
  .then(() => {
    console.log("done!");
    process.exit(0);
  })
  .catch(e => {
    console.log("Error", e);
    process.exit(1);
  });
