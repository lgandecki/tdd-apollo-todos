import { createServer } from "http";
import { createApp } from "./app";

const serverListen = async function serverListen() {
  const { app } = await createApp();
  const server = createServer(app);
  const port = process.env.PORT || 8080;

  server.listen(port, undefined, undefined, () =>
    // eslint-disable-next-line no-console
    console.log(`API Server is now running on http://localhost:${port}/graphql`)
  );
};

serverListen();
