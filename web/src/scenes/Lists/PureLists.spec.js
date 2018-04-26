/* eslint-env jest */
import React from "react";
import ReactDOM from "react-dom";
import Lists from "./PureLists";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Lists />, div);
  ReactDOM.unmountComponentAtNode(div);
});
