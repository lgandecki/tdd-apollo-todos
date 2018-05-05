/* global confirm */
/* eslint-disable no-alert, no-restricted-globals */

import React from "react";
import PropTypes from "prop-types";
import SweetAlert from "sweetalert2-react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import BaseComponent from "./BaseComponent";
import MobileMenu from "./MobileMenu";
import { showTodoItemsForList } from "../containers/ListPageContainer";

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
  mutation($listId: ID!, $text: String!) {
    AddTodo(listId: $listId, text: $text) {
      _id
      text
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

  onListFormSubmit(event) {
    event.preventDefault();
    this.saveList();
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
    // const { list } = this.props;
    // if (list.userId) {
    //   makePublic.call({ listId: list._id }, displayError);
    // } else {
    //   makePrivate.call({ listId: list._id }, displayError);
    // }
  }

  createTodo(event, addTodo) {
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
          <span className="count-list">{list.incompleteCount}</span>
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
            <a className="nav-item" onClick={this.toggleListPrivacy}>
              {list.userId ? (
                <span className="icon-lock" title="Make list public" />
              ) : (
                <span className="icon-unlock" title="Make list private" />
              )}
            </a>
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
      <form className="list-edit-form" onSubmit={this.onListFormSubmit}>
        <Mutation mutation={changeListNameMutation}>
          {changeListName => (
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
          )}
        </Mutation>
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
            refetchQueries={[
              {
                query: showTodoItemsForList,
                variables: { listId: this.props.list._id }
              }
            ]}
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
  list: PropTypes.object,
  menuOpen: PropTypes.object.isRequired
};
