import React from "react";
import PropTypes from "prop-types";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import { currentUserQuery } from "../queries/users/currentUserQuery";
import BaseComponent from "../components/BaseComponent";
import AuthPage from "./AuthPage";

const addUserMutation = gql`
  mutation($email: String!, $password: String!) {
    AddUser(email: $email, password: $password) {
      email
    }
  }
`;
class JoinPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { errors: {} });
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(event) {
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    const confirm = this.confirm.value;
    const errors = {};

    if (!email) {
      errors.email = "Email Required";
    }
    if (!password) {
      errors.password = "Password Required";
    }
    if (confirm !== password) {
      errors.confirm = "Password doesn't match the confirmation";
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }
    await this.props.client.mutate({
      mutation: addUserMutation,
      variables: {
        email,
        password
      },
      refetchQueries: [{ query: currentUserQuery }]
    });
    this.redirectTo("/");
    //
    // Accounts.createUser(
    //   {
    //     email,
    //     password
    //   },
    //   err => {
    //     if (err) {
    //       this.setState({
    //         errors: { none: err.reason }
    //       });
    //     }
    //     this.redirectTo("/");
    //   }
    // );
  }

  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && "error";

    const content = (
      <div className="wrapper-auth">
        <h1 className="title-auth">Join.</h1>
        <p className="subtitle-auth">
          Joining allows you to make private lists
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
          <div className={`input-symbol ${errorClass("confirm")}`}>
            <input
              type="password"
              name="confirm"
              ref={c => {
                this.confirm = c;
              }}
              placeholder="Confirm Password"
            />
            <span className="icon-lock" title="Confirm Password" />
          </div>
          <button type="submit" className="btn-primary">
            Join Now
          </button>
        </form>
      </div>
    );

    const link = (
      <Link to="/signin" className="link-auth-alt">
        Have an account? Sign in
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

JoinPage.propTypes = {
  menuOpen: PropTypes.object.isRequired
};

export default withApollo(JoinPage);
