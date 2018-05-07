import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";

import BaseComponent from "./BaseComponent";

const logoutMutation = gql`
  mutation {
    LogoutUser
  }
`;
class UserMenu extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { open: false });
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      open: !this.state.open
    });
  }

  async logout() {
    console.log("logout");
    await this.props.client.mutate({
      mutation: logoutMutation
    });
    this.props.client.cache.reset();
    this.props.client.resetStore();
  }
  renderLoggedIn() {
    const { open } = this.state;
    const { user } = this.props;
    console.log("Gandecki this.props", this.props.user);
    const { email } = user;
    const emailLocalPart = email.substring(0, email.indexOf("@"));
    return (
      <div className="user-menu vertical">
        <a href="#toggle" className="btn-secondary" onClick={this.toggle}>
          {open ? (
            <span className="icon-arrow-up" />
          ) : (
            <span className="icon-arrow-down" />
          )}
          {emailLocalPart}
        </a>
        {open ? (
          <a className="btn-secondary" onClick={this.logout}>
            Logout
          </a>
        ) : null}
      </div>
    );
  }

  renderLoggedOut() {
    return (
      <div className="user-menu">
        <Link to="/signin" className="btn-secondary">
          Sign In
        </Link>
        <Link to="/join" className="btn-secondary">
          Join
        </Link>
      </div>
    );
  }

  render() {
    if (this.props.user && this.props.user.email) {
      return this.renderLoggedIn();
    }
    return this.renderLoggedOut();
  }
}

UserMenu.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func
};

export default withApollo(UserMenu);
