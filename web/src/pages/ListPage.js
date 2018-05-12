import React from "react";
// import PropTypes from "prop-types";

import BaseComponent from "../components/BaseComponent";
import ListHeader from "../components/ListHeader";
import TodoItem from "../components/TodoItem";
// import NotFoundPage from "../pages/NotFoundPage";
import Message from "../components/Message";

export default class ListPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editingTodo: null });
    this.onEditingChange = this.onEditingChange.bind(this);
  }

  onEditingChange(id, editing) {
    this.setState({
      editingTodo: editing ? id : null
    });
  }

  render() {
    const { list } = this.props;
    const { todos } = list;
    const { editingTodo } = this.state;

    let Todos;
    if (!todos || !todos.length) {
      Todos = (
        <Message
          title="No tasks here"
          subtitle="Add new tasks using the field above"
        />
      );
    } else {
      Todos = todos.map(todo => (
        <TodoItem
          todo={todo}
          listId={list._id}
          key={todo._id}
          editing={todo._id === editingTodo}
          onEditingChange={this.onEditingChange}
        />
      ));
    }

    return (
      <div className="page lists-show">
        <ListHeader list={list} menuOpen={this.props.menuOpen} />
        <div className="content-scrollable list-items">{Todos}</div>
      </div>
    );
  }
}
