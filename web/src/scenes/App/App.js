import gql from "graphql-tag";
import { graphql } from "react-apollo";
import "./App.css";
import PureApp from "./PureApp";

export default graphql(gql`
  query TodoAppQuery {
    Lists {
      name
      incompleteCount
    }
  }
`)(PureApp);
