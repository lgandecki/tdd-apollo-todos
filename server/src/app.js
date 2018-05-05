import express, { json, urlencoded } from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import schema from "./api/graphql/schema";
import { dbConnector } from "./api/common/MongoRepository";
import { repositories } from "./api/graphql/repositories";

const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");

const MongoStore = require("connect-mongo")(session);

const createApp = async () => {
  const app = express();
  const db = await dbConnector();

  console.log("Gandecki db", db);
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  app.use(
    session({
      store: new MongoStore({ db }),
      secret: process.env.SESSION_SECRET || "development secret",
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // FIXES CORS ERROR - LEAVING THIS AND THE LOGIC IN corsOption commented out
  // so if you need to block other domains, you have an example
  //   const whitelist = [
  //     'http://localhost:3000',
  //     'http://localhost:4000',
  //     'http://thebrain.pro',
  //     'https://thebrain.pro'
  //   ]

  const corsOptions = {
    origin(origin, callback) {
      // var originIsWhitelisted = whitelist.indexOf(origin) !== -1 || !origin
      // callback(null, originIsWhitelisted)
      callback(null, true);
    },
    credentials: true
  };

  app.use(cors(corsOptions));

  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(
    "/graphql",
    graphqlExpress(req => ({
      schema,
      context: {
        ...repositories,
        user: req.user,
        req
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
