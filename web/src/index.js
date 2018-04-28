import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import apolloClient from "./apolloClient";
import Routes from "./Routes";

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Routes />
  </ApolloProvider>,
  document.getElementById("root")
);

registerServiceWorker();
