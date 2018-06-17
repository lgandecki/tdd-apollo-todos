import express, { json, urlencoded } from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-custom-ws";
import { execute, subscribe } from "graphql";
import schema from "./api/graphql/schema";
import { dbConnector } from "./api/common/MongoRepository";
import { repositories } from "./api/graphql/repositories";
import prepareGetUserFromPassport from "./prepareGetUserFromPassport";

const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");

const MongoStore = require("connect-mongo")(session);

const createApp = async () => {
  const app = express();
  const db = await dbConnector();

  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser(({ password, ...userDeserialized }, cb) => {
    cb(null, userDeserialized);
  });

  const key = "connect.sid";
  const store = new MongoStore({ db });
  const secret = process.env.SESSION_SECRET || "development secret";
  app.use(
    session({
      key,
      store,
      secret,
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const getUserFromPassport = prepareGetUserFromPassport({
    key,
    secret,
    store,
    passport
  });

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

  const WS_PORT = 5000;

  // Create WebSocket listener server
  const websocketServer = createServer(app);

  // Bind it to port and start listening
  websocketServer.listen(WS_PORT, () =>
    console.log(
      `Websocket Server is now running on http://localhost:${WS_PORT}`
    )
  );

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onOperation: (message, params, webSocket) =>
        // console.log("Gandecki params", params);
        // console.log("Gandecki message", message);
        getUserFromPassport(webSocket.upgradeReq)
          .then(user => ({
            ...params,
            context: { user }
          }))
          .catch(() => ({ ...params, context: { user: {} } }))
    },
    {
      server: websocketServer,
      path: "/graphql"
    }
  );

  return { app };
};

module.exports = {
  createApp
};
