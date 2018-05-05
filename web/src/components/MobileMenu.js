import React from "react";
import BaseComponent from "./BaseComponent";

class MobileMenu extends BaseComponent {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.props.menuOpen.set(!this.props.menuOpen.get());
  }

  render() {
    return (
      <div className="nav-group">
        <a href="#toggle-menu" className="nav-item" onClick={this.toggleMenu}>
          <span className="icon-list-unordered" title="Show menu" />
        </a>
      </div>
    );
  }
}

MobileMenu.propTypes = {
  // menuOpen: PropTypes.object.isRequired
};

export default MobileMenu;
