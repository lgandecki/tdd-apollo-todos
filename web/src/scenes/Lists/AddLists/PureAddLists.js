/* eslint-disable react/prop-types */
import React, { Fragment } from "react";

export default class PureAddLists extends React.Component {
  constructor() {
    super();
    this.state = { newListName: "" };
    this.changeNewListName = this.changeNewListName.bind(this);
    this.addList = this.addList.bind(this);
  }

  changeNewListName(e) {
    this.setState({ newListName: e.target.value });
  }

  addList() {
    this.props.addList(this.state.newListName);
  }

  render() {
    return (
      <Fragment>
        <label>
          New List<input onChange={this.changeNewListName} />
        </label>
        <button onClick={this.addList}>Add List</button>
      </Fragment>
    );
  }
}
