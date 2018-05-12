/* global confirm */
/* eslint-disable no-alert, no-restricted-globals */

import React from "react";
import PropTypes from "prop-types";
import SweetAlert from "sweetalert2-react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { allListsQuery } from "shared/graphql/lists/allListsQuery";
import BaseComponent from "./BaseComponent";
import MobileMenu from "./MobileMenu";

const removeListMutation = gql`
  mutation RemoveList($listId: ID!) {
    RemoveList(listId: $listId)
  }
`;

const changeListNameMutation = gql`
  mutation($listId: ID!, $newName: String!) {
    ChangeListName(listId: $listId, newName: $newName) {
      _id
      name
    }
  }
`;

const addNewTodoMutation = gql`
  mutation AddTodo($listId: ID!, $text: String!) {
    AddTodo(listId: $listId, text: $text) {
      _id
      checked
      text
    }
  }
`;

const toggleListPrivacyMutation = gql`
  mutation($listId: ID!) {
    ToggleListPrivacy(listId: $listId) {
      _id
      userId
      name
    }
  }
`;

// import {
//   updateName,
//   makePublic,
//   makePrivate,
// } from "../../api/lists/methods.js";
// import { insert } from "../../api/todos/methods.js";

export default class ListHeader extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      showDeleteListConfirmation: false
    };
    this.onListFormSubmit = this.onListFormSubmit.bind(this);
    this.onListInputKeyUp = this.onListInputKeyUp.bind(this);
    this.onListInputBlur = this.onListInputBlur.bind(this);
    this.onListDropdownAction = this.onListDropdownAction.bind(this);
    this.editList = this.editList.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.saveList = this.saveList.bind(this);
    this.deleteList = this.deleteList.bind(this);
    this.toggleListPrivacy = this.toggleListPrivacy.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.focusTodoInput = this.focusTodoInput.bind(this);
    this.deleteConfirmation = this.deleteConfirmation.bind(this);
  }

  onListFormSubmit(event, saveListMutation) {
    event.preventDefault();
    this.saveList(saveListMutation);
  }

  onListInputKeyUp(event) {
    if (event.keyCode === 27) {
      this.cancelEdit();
    }
  }

  onListInputBlur(saveListMutation) {
    if (this.state.editing) {
      this.saveList(saveListMutation);
    }
  }

  onListDropdownAction(event) {
    if (event.target.value === "delete") {
      this.deleteList();
    } else {
      this.toggleListPrivacy();
    }
  }

  editList() {
    this.setState({ editing: true }, () => {
      this.listNameInput.focus();
    });
  }

  cancelEdit() {
    this.setState({ editing: false });
  }

  saveList(saveListMutation) {
    this.setState({ editing: false });
    saveListMutation({
      variables: {
        listId: this.props.list._id,
        newName: this.listNameInput.value
      }
    });
  }

  deleteConfirmation() {
    this.setState({ showDeleteListConfirmation: true });
  }

  deleteList(removeList) {
    this.setState({ showDeleteListConfirmation: false });
    removeList();
  }

  toggleListPrivacy() {
    const { list } = this.props;
    console.log("Gandecki list", list);

    // if (list.userId) {
    //   makePublic.call({ listId: list._id }, displayError);
    // } else {
    //   makePrivate.call({ listId: list._id }, displayError);
    // }
  }

  createTodo(event, addTodo) {
    console.log("on create I guess");
    event.preventDefault();
    const { newTodoInput } = this;
    const newTodoText = newTodoInput.value;
    const listId = this.props.list._id;
    newTodoInput.value = "";
    addTodo({ variables: { listId, text: newTodoText } });
  }

  focusTodoInput() {
    this.newTodoInput.focus();
  }

  renderDefaultHeader() {
    const { list } = this.props;
    return (
      <div>
        <MobileMenu menuOpen={this.props.menuOpen} />
        <h1 className="title-page" onClick={this.editList}>
          <span className="title-wrapper" data-testid="editListName">
            {list.name}
          </span>
          <span className="count-list">{list.todos.length}</span>
        </h1>
        <div className="nav-group right">
          <div className="nav-item options-mobile">
            <select
              className="list-edit"
              defaultValue="default"
              onChange={this.onListDropdownAction}
            >
              <option disabled value="default">
                Select an action
              </option>
              {list.userId ? (
                <option value="public">Make Public</option>
              ) : (
                <option value="private">Make Private</option>
              )}
              <option value="delete">Delete list</option>
            </select>
            <span className="icon-cog" />
          </div>
          <div className="options-web">
            <Mutation
              mutation={toggleListPrivacyMutation}
              variables={{ listId: list._id }}
            >
              {toggleListPrivacy => (
                <a className="nav-item" onClick={toggleListPrivacy}>
                  {list.userId ? (
                    <span className="icon-lock" title="Make list public" />
                  ) : (
                    <span className="icon-unlock" title="Make list private" />
                  )}
                </a>
              )}
            </Mutation>
            <a className="nav-item trash" onClick={this.deleteConfirmation}>
              <span
                className="icon-trash"
                title="Delete list"
                data-testid="deleteList"
              />
            </a>
            <Mutation
              mutation={removeListMutation}
              variables={{ listId: list._id }}
              refetchQueries={["AllLists"]}
            >
              {removeList => (
                <SweetAlert
                  show={this.state.showDeleteListConfirmation}
                  title="Delete list"
                  text={`Are you sure you want to delete the ${list.name} list`}
                  type="warning"
                  showCancelButton
                  confirmButtonText="Delete it!"
                  cancelButtonText="Nope"
                  onConfirm={() => {
                    this.deleteList(removeList);
                  }}
                  onCancel={() => {
                    this.setState({ showDeleteListConfirmation: false });
                  }}
                />
              )}
            </Mutation>
          </div>
        </div>
      </div>
    );
  }

  renderEditingHeader() {
    const { list } = this.props;
    return (
      <Mutation mutation={changeListNameMutation}>
        {changeListName => (
          <form
            className="list-edit-form"
            onSubmit={event => {
              this.onListFormSubmit(event, changeListName);
            }}
          >
            <input
              type="text"
              name="name"
              autoComplete="off"
              ref={c => {
                this.listNameInput = c;
              }}
              defaultValue={list.name}
              onKeyUp={this.onListInputKeyUp}
              onBlur={() => {
                this.onListInputBlur(changeListName);
              }}
            />
            <div className="nav-group right">
              <a
                className="nav-item"
                onMouseDown={this.cancelEdit}
                onClick={this.cancelEdit}
              >
                <span className="icon-close" title="Cancel" />
              </a>
            </div>
          </form>
        )}
      </Mutation>
    );
  }

  render() {
    const { editing } = this.state;
    return (
      this.renderRedirect() || (
        <nav className="list-header">
          {editing ? this.renderEditingHeader() : this.renderDefaultHeader()}
          <Mutation
            mutation={addNewTodoMutation}
            optimisticResponse={({ text }) => ({
              __typename: "Mutation",
              AddTodo: {
                __typename: "TodoItem",
                _id: "randomId",
                checked: false,
                text
              }
            })}
            update={(proxy, { data: { AddTodo } }) => {
              const data = proxy.readQuery({ query: allListsQuery });
              data.Lists.find(l => l._id === this.props.list._id).todos.push(
                AddTodo
              );
              proxy.writeQuery({ query: allListsQuery, data });
            }}
          >
            {addTodo => (
              <form
                className="todo-new input-symbol"
                data-testid="newTodoForm"
                onSubmit={event => this.createTodo(event, addTodo)}
              >
                <input
                  type="text"
                  ref={c => {
                    this.newTodoInput = c;
                  }}
                  placeholder="Type to add new tasks"
                />
                <span
                  className="icon-add"
                  data-testid="focusTodoInput"
                  onClick={this.focusTodoInput}
                />
              </form>
            )}
          </Mutation>
        </nav>
      )
    );
  }
}

ListHeader.propTypes = {
  list: PropTypes.object
  // menuOpen: PropTypes.object.isRequired
};
