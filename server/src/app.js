import express, { json, urlencoded } from "express";
import cors from "cors";
import schema from "./api/graphql/schema";
import { dbConnector } from "./api/common/MongoRepository";
import { repositories } from "./api/graphql/repositories";

const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");

const createApp = async () => {
  const app = express();
  await dbConnector();
  app.use(cors());

  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(
    "/graphql",
    graphqlExpress(() => ({
      schema,
      context: {
        ...repositories
      }
    }))
  );
  app.use(
    "/graphiql",
    graphiqlExpress({
      endpointURL: "/graphql"
    })
  );
  return { app };
};

module.exports = {
  createApp
};
