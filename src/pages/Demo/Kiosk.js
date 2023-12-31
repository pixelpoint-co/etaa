import { useMediaQuery } from 'react-responsive';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  v4 as uuidv4,
} from 'uuid';
import { Tooltip } from 'react-tooltip';
import { useMemo } from 'react';
import { ifProp } from 'styled-tools';
import { size } from 'styled-theme';
import Image from '../../components/atoms/Image';
import kioskSrc from '../../assets/image/kiosk.png';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';

const StyledTooltip = styled(Tooltip)`
  @keyframes float {
    0% {
      box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
      transform: translateX(-50px) translatey(0px);
    }
    50% {
      box-shadow: 0 10px 15px 0px rgba(0,0,0,0.2);
      transform: translateX(-50px) translatey(-8px);
    }
    100% {
      box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
      transform: translateX(-50px) translatey(0px);
    }
  }
  pointer-events: auto;
  margin-top: 50px;
  font-size: 18px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  transition: 0s;
  ${ifProp(
    'floating',
    css`
      animation: float 2s ease-in-out infinite;
    `,
  )}

  @media (max-width: ${size('mobileBreakpoint')}) {
    font-size: 14px;
    margin-left: 30px;
    margin-top: 30px;
    padding: 6px 12px;
  }
`;

const Container = styled(Button)`
  position: absolute;
  flex: 0;
  align-self: shrink;
  background-color: transparent;
  border-color: transparent;
  left: 0;
  translate: -2% -4%;
`;
const Kiosk = (props) => {
  const id = useMemo(
    () => uuidv4(),
    [],
  );

  const isMobile = useMediaQuery({ query: `(max-width: ${size('mobileBreakpoint')})` });
  return (
    <Container
      transparent
      data-tooltip-id={id}
      theme="grayscale"
      {...props}
    >
      <Image width={isMobile ? 165 : 330} height="auto" src={kioskSrc} />
      <StyledTooltip
        id={id}
        isOpen
        floating
      >
        order here
      </StyledTooltip>
    </Container>
  );
};

Kiosk.propTypes = {
  title: PropTypes.string,
  hourly: PropTypes.number,
  type: PropTypes.string,
  beforeTax: PropTypes.number,
  afterTax: PropTypes.number,
  date: PropTypes.string, // ISO string
};

Kiosk.defaultProps = {
  title: 'title',
  hourly: 10000,
  type: 'monthly',
  beforeTax: 321000,
  afterTax: 321000,
  date: moment().toISOString(),
};

export default Kiosk;
