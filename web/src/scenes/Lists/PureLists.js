import React from "react";
import PropTypes from "prop-types";

const PureLists = props => {
  const { loading, Lists } = props.data;
  if (loading) {
    return <div data-cy="loading">Loading...</div>;
  }
  return (
    <div className="App">
      {Lists.map(list => <div key={list.name}>{list.name}</div>)}
    </div>
  );
};

PureLists.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    Lists: PropTypes.array
  })
};

PureLists.defaultProps = {
  data: { loading: true }
};

export default PureLists;
