import React from 'react';
import PropTypes from 'prop-types';

const Divider = (props) => {
  const {
    verticalMargin,
    horizontalMargin,
    color,
    height,
  } = props;
  return (
    <div
      className="compose-divider"
      style={{
        margin: `${verticalMargin}px ${horizontalMargin}px`,
        backgroundColor: color,
        height,
      }}
    />
  );
};

Divider.defaultProps = {
  verticalMargin: 0,
  horizontalMargin: 0,
  color: '#D9D9D9',
  height: 1,
};

Divider.propTypes = {
  verticalMargin: PropTypes.number,
  horizontalMargin: PropTypes.number,
  color: PropTypes.string,
  height: PropTypes.number,
};

export default React.memo(Divider);
