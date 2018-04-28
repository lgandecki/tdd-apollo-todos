import PropTypes from "prop-types";
import React, { Component } from "react";
import { Router, Route, Link } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import Lists from "./scenes/Lists/Lists";
import DifferentApp from "./scenes/DifferentApp/DifferentApp";

export default class Routes extends Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    history: PropTypes.object
  };

  static defaultProps = {
    history: createHistory()
  };

  render() {
    return (
      <Router history={this.props.history}>
        <div>
          <ul>
            <li>
              <Link to="/">Lists</Link>
            </li>
            <li>
              <Link to="/differentApp">Different App</Link>
            </li>
          </ul>
          <hr />
          <Route exact path="/" component={Lists} />
          <Route path="/differentApp" component={DifferentApp} />
        </div>
      </Router>
    );
  }
}
