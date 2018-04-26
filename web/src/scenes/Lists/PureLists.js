import React from "react";
import PropTypes from "prop-types";

class PureLists extends React.Component {
  changeNewListName = e => {
    this.setState({ newListName: e.target.value });
  };
  addList = () => {
    this.props.addList(this.state.newListName);
  };
  removeList = event => {
    this.props.removeList(event.target.innerHTML);
  };
  render() {
    const { loading, Lists } = this.props.AllLists;
    if (loading) {
      return <div data-cy="loading">Loading...</div>;
    }
    return (
      <div className="App">
        <label htmlFor="newList">
          New List <input name="newList" onChange={this.changeNewListName} />
        </label>
        <button onClick={this.addList}>Add List</button>
        {Lists.map(list => (
          <div key={list.name} onClick={this.removeList}>
            {list.name}
          </div>
        ))}
      </div>
    );
  }
}

PureLists.propTypes = {
  AllLists: PropTypes.shape({
    loading: PropTypes.bool,
    Lists: PropTypes.array
  }),
  removeList: PropTypes.func.isRequired,
  addList: PropTypes.func.isRequired
};

PureLists.defaultProps = {
  AllLists: { loading: true }
};

export default PureLists;
