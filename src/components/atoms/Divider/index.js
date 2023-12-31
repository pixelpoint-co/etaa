import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Flex from '../Flex';

const StyledFlex = styled(Flex)`
  flex: 0;
  align-self: center;
`;

const Divider = (props) => {
  const {
    verticalMargin,
    horizontalMargin,
    color,
    size,
    width,
    direction,
  } = props;
  return (
    <StyledFlex
      className="compose-divider"
      style={{
        margin: `${verticalMargin}px ${horizontalMargin}px`,
        backgroundColor: color,
        ...(direction === 'horizontal'
          ? {
            height: width,
            minHeight: width,
            width: size,
            minWidth: size,
          }
          : {
            width,
            minWidth: width,
            minHeight: size,
            height: size,
          }),
      }}
    />
  );
};

Divider.defaultProps = {
  verticalMargin: 0,
  horizontalMargin: 0,
  color: '##D8D9DD',
  size: '100%',
  width: 2,
  direction: 'horizontal',
};

Divider.propTypes = {
  verticalMargin: PropTypes.number,
  horizontalMargin: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  width: PropTypes.number,
  direction: PropTypes.oneOf([
    'horizontal',
    'vertical',
  ]),
};

export default React.memo(Divider);
