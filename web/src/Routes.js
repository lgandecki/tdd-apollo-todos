import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Router, Route } from "react-router";
import createHistory from "history/createBrowserHistory";
import Lists from "./scenes/Lists/Lists";
import DifferentApp from "./scenes/DifferentApp/DifferentApp";
import List from "./scenes/List/List";

export default class Routes extends Component {
  // static propTypes = {
  //   // eslint-disable-next-line react/forbid-prop-types
  //   history: PropTypes.object
  // };
  //
  // static defaultProps = {
  //   history: createHistory()
  // };

  render() {
    return (
      <Router history={this.props.history}>
        <div>
          <ul>
            <li>
              <Link to="/list" data-testid="list">
                Lists
              </Link>
            </li>
            <li>
              <Link to="/differentApp" data-testid="differentApp">
                Different App
              </Link>
            </li>
          </ul>
          <hr />
          <Lists />
          <Route path="/differentApp" component={DifferentApp} />
          <Route path="/list/:listId" component={List} />
        </div>
      </Router>
    );
  }
}

Routes.propTypes = {
  history: PropTypes.func
};

Routes.defaultProps = {
  history: createHistory()
};
