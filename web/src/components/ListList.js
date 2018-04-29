/* global alert */

import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import BaseComponent from "./BaseComponent";

export default class ListList extends BaseComponent {
  // constructor(props) {
  //   super(props);
  //   // this.createNewList = this.createNewList.bind(this);
  // }

  // createNewList() {
  //   const listId = insert.call({ locale: i18n.getLocale() }, err => {
  //     if (err) {
  //       this.redirectTo("/");
  //       /* eslint-disable no-alert */
  //       alert(i18n.__("components.listList.newListError"));
  //     }
  //   });
  //   this.redirectTo(`/lists/${listId}`);
  // }

  render() {
    const { lists } = this.props;

    return (
      this.renderRedirect() || (
        <div className="list-todos">
          <a className="link-list-new">
            <span className="icon-plus" />
            New List
          </a>
          {lists.map(list => (
            <NavLink
              to={`/lists/${list._id}`}
              key={list._id}
              title={list.name}
              className="list-todo"
              activeClassName="active"
            >
              {list.userId ? <span className="icon-lock" /> : null}
              {list.incompleteCount ? (
                <span className="count-list">{list.incompleteCount}</span>
              ) : null}
              {list.name}
            </NavLink>
          ))}
        </div>
      )
    );
  }
}

ListList.propTypes = {
  lists: PropTypes.array
};
