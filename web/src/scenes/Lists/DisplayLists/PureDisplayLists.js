/* eslint-disable no-underscore-dangle */
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

export default ({ lists, removeList }) => {
  const removeEvent = event => {
    removeList(event.target.dataset.listName);
  };
  return lists.map(list => (
    <Fragment>
      <Link to={`/list/${list._id}`}>{list.name}</Link>
      <button onClick={removeEvent} data-list-name={list.name}>
        remove {list.name}
      </button>
    </Fragment>
  ));
};
