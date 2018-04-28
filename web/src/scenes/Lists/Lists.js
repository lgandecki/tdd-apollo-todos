import { graphql, compose } from "react-apollo";
import { allListsQuery } from "shared/graphql/lists/allListsQuery";
import gql from "graphql-tag";

import "./App.css";
import PureLists from "./PureLists";

export default compose(
  graphql(allListsQuery, { name: "AllLists" }),
  graphql(
    gql`
      mutation AddList($ListName: String!) {
        AddList(ListName: $ListName) {
          name
        }
      }
    `,
    {
      props: ({ mutate }) => ({
        addList: name =>
          mutate({
            variables: { ListName: name },
            refetchQueries: ["AllLists"]
          })
      })
    }
  ),
  graphql(
    gql`
      mutation RemoveList($ListName: String!) {
        RemoveList(ListName: $ListName)
      }
    `,
    {
      props: ({ mutate }) => ({
        removeList: name =>
          mutate({
            variables: { ListName: name },
            refetchQueries: ["AllLists"]
          })
      })
    }
  )
)(PureLists);
