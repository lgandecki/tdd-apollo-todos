import { graphql } from "react-apollo";
import { allListsQuery } from "shared/graphql/lists/allListsQuery";
import "./App.css";
import PureLists from "./PureLists";

export default graphql(allListsQuery)(PureLists);
