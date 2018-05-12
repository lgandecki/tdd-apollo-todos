import React from "react";
import { graphql } from "react-apollo";
import { Text, View } from "react-native";
import { allListsQuery } from "web/src/queries/lists/allListsQuery";

const PureApp = props => {
  const { loading, Lists } = props.data;
  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View>{Lists.map(list => <Text key={list.name}>{list.name}</Text>)}</View>
  );
};

export default graphql(allListsQuery)(PureApp);
