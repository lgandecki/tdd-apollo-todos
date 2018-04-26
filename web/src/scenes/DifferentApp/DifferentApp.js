import React from "react";
import Loadable from "react-loadable";

const LoadableBar = Loadable({
  loader: () => import("./DifferentAppPure"),
  loading() {
    return <div>Loading...</div>;
  }
});

export default class DifferentApp extends React.Component {
  render() {
    return <LoadableBar />;
  }
}
