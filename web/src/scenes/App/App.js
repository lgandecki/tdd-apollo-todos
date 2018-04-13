import { graphql } from "react-apollo";
import { allListsQuery } from "shared/graphql/lists/allListsQuery";
import "./App.css";
import PureApp from "./PureApp";

export default graphql(allListsQuery)(PureApp);
