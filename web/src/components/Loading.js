import React from "react";
import logo from "./logo-todos.svg";

class Loading extends React.Component {
  render() {
    return <img src={logo} className="loading-app" alt="Loading..." />;
  }
}

export default Loading;
