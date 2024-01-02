import React from 'react';
import PropTypes from 'prop-types';
import styled, {
  css,
} from 'styled-components';
import {
  switchProp, ifProp, prop,
} from 'styled-tools';

import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import Flex from '../../atoms/Flex';
import {
  pulseStyle,
} from '../../atoms/Pulse';
import theme from '../../../theme';
import { defaultStyle } from '../../atoms/Pulse/style';

const StyledButton = styled(Button)`
  max-width: 100%;
`;

const Wrapper = styled(Flex)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0;
`;

const StyledIcon = styled(Icon)`
  border-radius: ${prop('size')}px;
  ${ifProp(
    '$shouldAnimate',
    pulseStyle,
    defaultStyle,
  )}
  &::before {
    border-radius: ${prop('size')}px;
  }
  &::after {
    border-radius: ${prop('size')}px;
  }
  svg {
    padding: 6px;
    /* border-radius: 55px; */
  }
`;

const ErrorPulse = (props) => {
  const {
    shouldAnimate,
    size = 64,
    fill = 'white',
    loading,
    ...others
  } = props;
  return (
    <Wrapper size={size} {...others}>
      <StyledIcon
        icon={loading ? 'loader' : 'alert'}
        fill="white"
        size={size}
        $shouldAnimate={shouldAnimate}
      />
    </Wrapper>
  );
};

ErrorPulse.propTypes = {
  size: PropTypes.number,
  shouldAnimate: PropTypes.bool,
};

ErrorPulse.defaultProps = {
  size: 64,
  shouldAnimate: true,
};

export default ErrorPulse;
