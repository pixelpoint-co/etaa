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

const StyledButton = styled(Button)`
  max-width: 100%;
`;

const Wrapper = styled(Flex)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconButton = (props) => {
  const {
    icon,
    iconSize = 20,
    style,
    ...others
  } = props;
  return (
    <StyledButton
      {...others}
    >
      <Wrapper>
        <Icon
          icon={icon}
          size={iconSize}
        />
      </Wrapper>
    </StyledButton>
  );
};

IconButton.propTypes = { icon: PropTypes.string.isRequired };

IconButton.defaultProps = {};

export default IconButton;
