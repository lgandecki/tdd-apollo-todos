/* global alert */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { allListsQuery } from "../queries/lists/allListsQuery";
import BaseComponent from "./BaseComponent";

const addListMutation = gql`
  mutation AddList($listName: String!) {
    AddList(listName: $listName) {
      name
    }
  }
`;

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
          <Mutation
            mutation={addListMutation}
            refetchQueries={[{ query: allListsQuery }]}
            variables={{ listName: "Empty List" }}
          >
            {addList => (
              <a className="link-list-new" onClick={addList}>
                <span className="icon-plus" />
                New List
              </a>
            )}
          </Mutation>
          {lists.map(list => (
            <NavLink
              to={`/lists/${list._id}`}
              key={list._id}
              title={list.name}
              className="list-todo"
              activeClassName="active"
            >
              {list.userId ? <span className="icon-lock" /> : null}
              {list.todos.length ? (
                <span className="count-list">{list.todos.length}</span>
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
