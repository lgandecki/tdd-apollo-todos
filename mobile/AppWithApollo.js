import React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Text, View } from "react-native";

const PureApp = props => {
  const { loading, Lists } = props.data;
  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View>
      {Lists.map(list => <Text key={list.name}>{list.name}</Text>)}
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Changes you make will automatically reload.</Text>
      <Text>Shake your phone to open the developer menu.</Text>
    </View>
  );
};

export default graphql(gql`
  query TodoAppQuery {
    Lists {
      name
      incompleteCount
    }
  }
`)(PureApp);
