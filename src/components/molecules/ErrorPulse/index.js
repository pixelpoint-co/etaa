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

const StyledButton = styled(Button)`
  max-width: 100%;
`;

const Wrapper = styled(Flex)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledIcon = styled(Icon)`
  border-radius: ${prop('size')}px;
  ${pulseStyle}
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
    size = 64,
    ...others
  } = props;
  return (
    <Wrapper size={size}>
      <StyledIcon
        icon="alert"
        fill="white"
        size={size}
      />
    </Wrapper>
  );
};

ErrorPulse.propTypes = { size: PropTypes.number };

ErrorPulse.defaultProps = { size: 64 };

export default ErrorPulse;
