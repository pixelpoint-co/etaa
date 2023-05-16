import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Flex from '../Flex';

const StyledFlex = styled(Flex)`
  flex: 0;
`;

const Divider = (props) => {
  const {
    verticalMargin,
    horizontalMargin,
    color,
    size,
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
            height: size,
            width: '100%',
          }
          : {
            width: size,
            height: '100%',
          }),
      }}
    />
  );
};

Divider.defaultProps = {
  verticalMargin: 0,
  horizontalMargin: 0,
  color: '#D9D9D9',
  size: 1,
  direction: 'horizontal',
};

Divider.propTypes = {
  verticalMargin: PropTypes.number,
  horizontalMargin: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  direction: PropTypes.oneOf([
    'horizontal',
    'vertical',
  ]),
};

export default React.memo(Divider);
