const express = require("express");
const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");

const createApp = () => {
  const app = express();
  app.use("/graphl", graphqlExpress(() => ({})));
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
