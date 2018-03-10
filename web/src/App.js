import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import "./App.css";

class App extends Component {
  render() {
    const { loading, Lists } = this.props.data;
    if (loading) {
      return <div data-cy="loading">Loading...</div>;
    }
    return (
      <div className="App">
        {Lists.map(list => <div key={list.name}>{list.name}</div>)}
      </div>
    );
  }
}

App.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    Lists: PropTypes.array
  })
};

App.defaultProps = {
  data: { loading: true }
};

export default graphql(gql`
  query TodoAppQuery {
    Lists {
      name
      incompleteCount
    }
  }
`)(App);
