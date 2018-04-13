import React from "react";
import { ApolloProvider } from "react-apollo";
import apolloClient from "./apolloClient";
import AppWithApollo from "./AppWithApollo";

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <AppWithApollo />
      </ApolloProvider>
    );
  }
}
