import React from "react";

export default ({ lists, removeList }) => {
  const onClick = event => {
    removeList(event.target.innerHTML);
  };
  return lists.map(list => (
    <div key={list.name} onClick={onClick}>
      {list.name}
    </div>
  ));
};
