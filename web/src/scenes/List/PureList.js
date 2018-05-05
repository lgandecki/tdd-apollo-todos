import React from "react";

export default props =>
  props.todoItems.map(todoItem => <div>{todoItem.name}</div>);
