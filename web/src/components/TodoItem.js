import React from "react";
import PropTypes from "prop-types";
import { Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
import _ from "lodash";
import classnames from "classnames";
import { allListsQuery } from "shared/graphql/lists/allListsQuery";
import BaseComponent from "./BaseComponent";

const removeItemMutation = gql`
  mutation RemoveItem($itemId: ID!) {
    RemoveItem(itemId: $itemId)
  }
`;

const toggleTodoCheckMutation = gql`
  mutation($itemId: ID!, $checked: Boolean!) {
    ToggleTodoCheck(itemId: $itemId, checked: $checked) {
      _id
      checked
    }
  }
`;

const renameTodoMutation = gql`
  mutation($todoId: ID!, $newText: String!) {
    RenameTodo(todoId: $todoId, newText: $newText) {
      _id
      text
    }
  }
`;
class TodoItem extends BaseComponent {
  constructor(props) {
    super(props);
    this.throttledUpdate = _.throttle(async value => {
      if (value) {
        await props.client.mutate({
          mutation: renameTodoMutation,
          variables: {
            todoId: this.props.todo._id,
            newText: value
          }
        });
      }
    }, 300);

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

  setTodoCheckStatus(event, toggleTodo) {
    event.preventDefault();
    toggleTodo({
      variables: { itemId: this.props.todo._id, checked: event.target.checked }
    });
  }

  updateTodo(event) {
    this.throttledUpdate(event.target.value);
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
        <Mutation mutation={toggleTodoCheckMutation}>
          {toggleTodo => (
            <label
              className="checkbox"
              htmlFor={todo._id}
              title={`check-${todo.text}`}
            >
              <input
                id={todo._id}
                type="checkbox"
                checked={todo.checked}
                name="checked"
                data-testid={`checkbox-${todo.text}`}
                onChange={event => this.setTodoCheckStatus(event, toggleTodo)}
              />
              <span className="checkbox-custom" />
            </label>
          )}
        </Mutation>
        <input
          type="text"
          defaultValue={todo.text}
          placeholder="Task name"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.updateTodo}
        />
        <Mutation
          mutation={removeItemMutation}
          variables={{ itemId: todo._id }}
          update={proxy => {
            const data = proxy.readQuery({ query: allListsQuery });
            const list = data.Lists.find(l => l._id === this.props.listId);
            list.todos = _.reject(list.todos, t => t._id === todo._id);
            proxy.writeQuery({ query: allListsQuery, data });
          }}
        >
          {removeItem => (
            <a
              className="delete-item"
              href="#delete"
              onClick={removeItem}
              onMouseDown={removeItem}
            >
              <span className="icon-trash" data-testid="deleteItem" />
            </a>
          )}
        </Mutation>
      </div>
    );
  }
}

export default withApollo(TodoItem);

TodoItem.propTypes = {
  todo: PropTypes.object,
  editing: PropTypes.bool,
  onEditingChange: PropTypes.func
};
