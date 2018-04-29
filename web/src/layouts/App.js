import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { Switch, Redirect } from "react-router-dom";
import { Router, Route } from "react-router";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import _ from "lodash";
// import { Lists } from "../../api/lists/lists.js";
// import UserMenu from "../components/UserMenu.jsx";
import ListList from "../components/ListList";
// import LanguageToggle from "../components/LanguageToggle.jsx";
// import ConnectionNotification from "../components/ConnectionNotification.jsx";
import Loading from "../components/Loading";
import ListPageContainer from "../containers/ListPageContainer";
import PropTypes from "prop-types";
import createHistory from "history/createBrowserHistory";
import { allListsQuery } from "shared/graphql/lists/allListsQuery";
// import AuthPageSignIn from "../pages/AuthPageSignIn.jsx";
// import AuthPageJoin from "../pages/AuthPageJoin.jsx";
// import NotFoundPage from "../pages/NotFoundPage.jsx";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // showConnectionIssue: false,
      defaultList: null,
      redirectTo: null,
      menuOpen: false,
      loading: true
    };
    this.closeMenu = this.toggleMenu.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // setTimeout(() => {
    //   /* eslint-disable react/no-did-mount-set-state */
    //   this.setState({ showConnectionIssue: true });
    // }, CONNECTION_ISSUE_TIMEOUT);
  }

  toggleMenu() {
    this.setState(prevState => ({ menuOpen: !prevState.menuOpen }));
  }

  logout() {
    // Meteor.logout();
    this.setState({
      redirectTo: this.state.defaultList
    });
  }

  renderRedirect(location, lists) {
    const { redirectTo } = this.state;
    const { pathname } = location;
    let redirect = null;
    if (pathname === "/" && lists[0]._id) {
      redirect = <Redirect to={`lists/${lists[0]._id}`} />;
    }
    return redirect;
  }

  renderContent(location, lists) {
    const { loading } = this.props;

    const commonChildProps = {
      menuOpen: this.state.menuOpen
    };

    return (
      <div id="container" className={this.state.menuOpen ? "menu-open" : ""}>
        <section id="menu">
          <ListList lists={lists} />
        </section>
        <div className="content-overlay" onClick={this.closeMenu} />
        <div id="content-container">
          {loading ? (
            <Loading key="loading" />
          ) : (
            <TransitionGroup>
              <CSSTransition key={location.key} classNames="fade" timeout={200}>
                <Switch location={location}>
                  <Route
                    path="/lists/:listId"
                    render={({ match: { params: { listId } } }) => {
                      const list = _.find(lists, l => l._id === listId);
                      return (
                        <ListPageContainer list={list} {...commonChildProps} />
                      );
                    }}
                  />
                  <Route
                    path="/signin"
                    render={() => <ListPageContainer {...commonChildProps} />}
                  />
                  <Route
                    path="/join"
                    render={() => <ListPageContainer {...commonChildProps} />}
                  />
                  <Route path="/*" render={() => <Loading key="loading" />} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          )}
        </div>
      </div>
    );
  }

  render() {
    return (
      <Router history={this.props.history}>
        <Query query={allListsQuery}>
          {({ loading, data }) => {
            if (loading) {
              return <Loading key="loading" />;
            }
            const { Lists } = data;
            return (
              <Route
                render={({ location }) =>
                  this.renderRedirect(location, Lists) ||
                  this.renderContent(location, Lists)
                }
              />
            );
          }}
        </Query>
      </Router>
    );
  }
}

App.propTypes = {
  history: PropTypes.func
};

App.defaultProps = {
  history: createHistory()
};