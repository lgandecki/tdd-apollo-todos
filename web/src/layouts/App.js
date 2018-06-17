import React, { Component } from "react";
import { Query } from "react-apollo";
import { Switch, Redirect } from "react-router-dom";
import { Router, Route } from "react-router";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import _ from "lodash";
import PropTypes from "prop-types";
import createHistory from "history/createBrowserHistory";
import gql from "graphql-tag";
import { allListsQuery } from "../queries/lists/allListsQuery";
import { currentUserQuery } from "../queries/users/currentUserQuery";
// import { Lists } from "../../api/lists/lists.js";
// import UserMenu from "../components/UserMenu.jsx";
import ListList from "../components/ListList";
// import LanguageToggle from "../components/LanguageToggle.jsx";
// import ConnectionNotification from "../components/ConnectionNotification.jsx";
import Loading from "../components/Loading";
import UserMenu from "../components/UserMenu";
import AuthPageJoin from "../pages/AuthPageJoin";
import AuthPageSignIn from "../pages/AuthPageSignIn";
import ListPage from "../pages/ListPage";
// import AuthPageSignIn from "../pages/AuthPageSignIn.jsx";
// import AuthPageJoin from "../pages/AuthPageJoin.jsx";
// import NotFoundPage from "../pages/NotFoundPage.jsx";

const LISTS_SUBSCRIPTION = gql`
  subscription AddedList {
    AddedList {
      _id
      name
      incompleteCount
      userId
    }
  }
`;

const LIST_REMOVED_SUBSCRIPTION = gql`
  subscription RemovedList {
    RemovedList
  }
`;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // showConnectionIssue: false,
      // defaultList: null,
      menuOpen: false
    };
    this.closeMenu = this.toggleMenu.bind(this);
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

  renderRedirect(location, lists) {
    const { pathname } = location;
    let redirect = null;
    if (pathname.includes("/lists/")) {
      const listId = pathname.split("/")[2];
      const list = _.find(lists, l => l._id === listId);
      if (!list) {
        redirect = <Redirect to={`/lists/${lists[0]._id}`} />;
      }
    }
    if (pathname === "/" && lists[0]._id) {
      redirect = <Redirect to={`/lists/${lists[0]._id}`} />;
    }
    return redirect;
  }

  renderContent(location, lists, subscribeToNewLists) {
    const commonChildProps = {
      menuOpen: this.state.menuOpen
    };

    return (
      <div id="container" className={this.state.menuOpen ? "menu-open" : ""}>
        <section id="menu">
          <Query query={currentUserQuery}>
            {({ loading, data }) => {
              if (loading) {
                return <Loading key="loading" />;
              }
              const { CurrentUser } = data;
              return <UserMenu user={CurrentUser} />;
            }}
          </Query>
          <ListList lists={lists} subscribeToNewLists={subscribeToNewLists} />
        </section>
        <div className="content-overlay" onClick={this.closeMenu} />
        <div id="content-container">
          <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={200}>
              <Switch location={location}>
                <Route
                  path="/lists/:listId"
                  render={({
                    match: {
                      params: { listId }
                    }
                  }) => {
                    const list = _.find(lists, l => l._id === listId);
                    if (list) {
                      return <ListPage list={list} {...commonChildProps} />;
                    }
                    return <Loading key="loading" />;
                  }}
                />
                <Route
                  path="/signin"
                  render={() => <AuthPageSignIn {...commonChildProps} />}
                />
                <Route
                  path="/join"
                  render={() => <AuthPageJoin {...commonChildProps} />}
                />
                <Route path="/*" render={() => <Loading key="loading" />} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Router history={this.props.history}>
        <Query query={allListsQuery}>
          {({ subscribeToMore, loading, data, error }) => {
            if (error) {
              console.log("Gandecki error", error);
            }
            if (loading) {
              return <Loading key="loading" />;
            }
            const subscribeToNewLists = () => {
              subscribeToMore({
                document: LISTS_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data.AddedList) return prev;
                  const newList = subscriptionData.data.AddedList;
                  if (prev.Lists.find(l => l._id === newList._id)) {
                    return prev;
                  }
                  return {
                    ...prev,
                    Lists: [...prev.Lists, { ...newList, todos: [] }]
                  };
                }
              });
              subscribeToMore({
                document: LIST_REMOVED_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => ({
                  ...prev,
                  Lists: prev.Lists.filter(
                    l => l._id !== subscriptionData.data.RemovedList
                  )
                })
              });
            };

            const { Lists } = data;
            return (
              <Route
                render={({ location }) =>
                  this.renderRedirect(location, Lists) ||
                  this.renderContent(location, Lists, subscribeToNewLists)
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
  history: PropTypes.object
};

App.defaultProps = {
  history: createHistory()
};
