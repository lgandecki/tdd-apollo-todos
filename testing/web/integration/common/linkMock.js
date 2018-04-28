import React from "react";

jest.mock("react-router-dom", () => ({
  Link: props => {
    // eslint-disable-next-line global-require
    const { withRouter } = require("react-router");
    const RealLink = internalProps => {
      const changePath = () => {
        internalProps.history.push(internalProps.to);
      };
      const newProps = { ...internalProps };

      delete newProps.to;
      delete newProps.location;
      delete newProps.match;
      delete newProps.history;
      return (
        <a href={internalProps.to} {...newProps} onClick={changePath}>
          {internalProps.children}
        </a>
      );
    };
    const Wrapped = withRouter(RealLink);
    return <Wrapped {...props} />;
  }
}));
