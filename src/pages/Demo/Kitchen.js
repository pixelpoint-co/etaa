import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  v4 as uuidv4,
} from 'uuid';
import { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import { ifProp } from 'styled-tools';
import { size } from 'styled-theme';
import { useMediaQuery } from 'react-responsive';
import Image from '../../components/atoms/Image';
import kitchenSrc from '../../assets/image/kitchen.png';
import Flex from '../../components/atoms/Flex';
import theme from '../../theme';
import Text from '../../components/atoms/P';
import Button from '../../components/atoms/Button';

const Container = styled(Button)`
  position: absolute;
  flex: 0;
  align-self: shrink;
  background-color: transparent;
  border-color: transparent;
  right: 0;
  translate: 7% -2%;
  padding: 0px;
`;
const StyledTooltip = styled(Tooltip)`
  pointer-events: auto;
  margin-top: 5%;
  margin-left: 30%;
  font-size: 18px;
  letter-spacing: 0.8px;
  text-transform: uppercase;

  ${ifProp(
    'floating',
    css`
      animation: float 2s ease-in-out infinite;
      animation-delay: 1s;
    `,
  )}
  @media (max-width: ${size('mobileBreakpoint')}) {
    font-size: 14px;
    padding: 6px 12px;
  }
`;
const Kitchen = (props) => {
  const id = useMemo(
    () => uuidv4(),
    [],
  );
  const isMobile = useMediaQuery({ query: `(max-width: ${theme.sizes.mobileBreakpoint})` });

  return (
    <Container
      transparent
      data-tooltip-id={id}
      theme="grayscale"
      {...props}
    >
      <Image width={isMobile ? 185 : 370} height="auto" src={kitchenSrc} />
      <StyledTooltip
        id={id}
        isOpen
        floating
      >
        cook here
      </StyledTooltip>
    </Container>
  );
};

Kitchen.propTypes = {};

Kitchen.defaultProps = {};

export default Kitchen;
