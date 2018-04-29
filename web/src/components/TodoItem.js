import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
// import _ from "underscore";
import classnames from "classnames";
import BaseComponent from "./BaseComponent";
import { showTodoItemsForList } from "../containers/ListPageContainer";
// import { displayError } from "../helpers/errors.js";

// import {
//   setCheckedStatus,
//   updateText,
//   remove
// } from "../../api/todos/methods.js";

const removeItemMutation = gql`
  mutation RemoveItem($ItemId: ID!) {
    RemoveItem(ItemId: $ItemId)
  }
`;
export default class TodoItem extends BaseComponent {
  constructor(props) {
    super(props);
    // this.throttledUpdate = _.throttle(value => {
    //   if (value) {
    //     updateText.call(
    //       {
    //         todoId: this.props.todo._id,
    //         newText: value
    //       },
    //       displayError
    //     );
    //   }
    // }, 300);

    this.setTodoCheckStatus = this.setTodoCheckStatus.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    this.props.onEditingChange(this.props.todo._id, true);
  }

  onBlur() {
    this.props.onEditingChange(this.props.todo._id, false);
  }

  setTodoCheckStatus(event) {
    // setCheckedStatus.call({
    //   todoId: this.props.todo._id,
    //   newCheckedStatus: event.target.checked
    // });
  }

  updateTodo(event) {
    // this.throttledUpdate(event.target.value);
  }

  deleteTodo() {
    console.log("clicked");
    // remove.call({ todoId: this.props.todo._id }, displayError);
  }

  render() {
    const { todo, editing } = this.props;
    const todoClass = classnames({
      "list-item": true,
      checked: todo.checked,
      editing
    });
    return (
      <div className={todoClass} data-testid={todo.text}>
        <label className="checkbox" htmlFor={todo._id}>
          <input
            id={todo._id}
            type="checkbox"
            checked={todo.checked}
            name="checked"
            onChange={this.setTodoCheckStatus}
          />
          <span className="checkbox-custom" />
        </label>
        <input
          type="text"
          defaultValue={todo.text}
          placeholder="Task name"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.updateTodo}
        />
        <Mutation mutation={removeItemMutation}>
          {removeItem => {
            const removeItemNew = () => {
              removeItem({
                variables: { ItemId: todo._id },
                refetchQueries: [
                  {
                    query: showTodoItemsForList,
                    variables: { ListId: this.props.listId }
                  }
                ]
              });
            };
            return (
              <a
                className="delete-item"
                href="#delete"
                onClick={removeItemNew}
                onMouseDown={removeItemNew}
              >
                <span className="icon-trash" data-testid="deleteItem" />
              </a>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

TodoItem.propTypes = {
  todo: PropTypes.object,
  editing: PropTypes.bool,
  onEditingChange: PropTypes.func
};