import React from "react";
import PropTypes from "prop-types";
import BaseComponent from "../components/BaseComponent";
import MobileMenu from "../components/MobileMenu";
import Message from "../components/Message";

class NotFoundPage extends BaseComponent {
  render() {
    return (
      <div className="page not-found">
        <nav>
          <MobileMenu menuOpen={this.props.menuOpen} />
        </nav>
        <div className="content-scrollable">
          <Message title="Page not found" />
        </div>
      </div>
    );
  }
}

NotFoundPage.propTypes = {
  menuOpen: PropTypes.object.isRequired
};

export default NotFoundPage;
