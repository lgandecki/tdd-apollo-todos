import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import { currentUserQuery } from "../queries/users/currentUserQuery";
import { allListsQuery } from "../queries/lists/allListsQuery";
import BaseComponent from "../components/BaseComponent";
import AuthPage from "./AuthPage";

const loginUserMutation = gql`
  mutation($email: String!, $password: String!) {
    LoginUser(email: $email, password: $password) {
      email
    }
  }
`;
class AuthPageSignIn extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { errors: {} });
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(event) {
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    const errors = {};

    if (!email) {
      errors.email = "email required";
    }
    if (!password) {
      errors.password = "password required";
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }

    // login
    await this.props.client.mutate({
      mutation: loginUserMutation,
      variables: {
        email,
        password
      },
      refetchQueries: [{ query: currentUserQuery }, { query: allListsQuery }]
    });

    this.setState({
      errors: { none: "reson" }
    });

    this.redirectTo("/");
  }

  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && "error";

    const content = (
      <div className="wrapper-auth">
        <h1 className="title-auth">Sign In</h1>
        <p className="subtitle-auth">
          Signing in allows you to view private lists
        </p>
        <form onSubmit={this.onSubmit}>
          <div className="list-errors">
            {errorMessages.map(msg => (
              <div className="list-item" key={msg}>
                {msg}
              </div>
            ))}
          </div>
          <div className={`input-symbol ${errorClass("email")}`}>
            <input
              type="email"
              name="email"
              ref={c => {
                this.email = c;
              }}
              placeholder="Your Email"
            />
            <span className="icon-email" title="Your Email" />
          </div>
          <div className={`input-symbol ${errorClass("password")}`}>
            <input
              type="password"
              name="password"
              ref={c => {
                this.password = c;
              }}
              placeholder="Password"
            />
            <span className="icon-lock" title="Password" />
          </div>
          <button type="submit" className="btn-primary" data-testid="signInNow">
            Sign In
          </button>
        </form>
      </div>
    );

    const link = (
      <Link to="/join" className="link-auth-alt">
        Need an account? Join Now.
      </Link>
    );

    return (
      this.renderRedirect() || (
        <AuthPage
          content={content}
          link={link}
          menuOpen={this.props.menuOpen}
        />
      )
    );
  }
}

AuthPageSignIn.propTypes = {
  menuOpen: PropTypes.object.isRequired
};

export default withApollo(AuthPageSignIn);
