import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { palette } from 'styled-theme';
import {
  v4 as uuidv4,
} from 'uuid';
import { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import { ifProp } from 'styled-tools';
import Image from '../../components/atoms/Image';
import kitchenSrc from '../../assets/image/kitchen.png';
import Card from '../../components/atoms/Card';
import Flex from '../../components/atoms/Flex';
import ErrorPulse from '../../components/molecules/ErrorPulse';
import pasta from '../../assets/image/pasta.png';

const Container = styled(Flex)`
  flex: 0;
  align-self: shrink;
  background-color: transparent;
  position: absolute;
  right: 0;
  translate: 8% -2%;
`;
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
  margin-top: 5%;
  margin-left: 30%;
  font-size: 18px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  transition: 0s;
  ${ifProp(
    'floating',
    css`
      animation: float 2s ease-in-out infinite;
      animation-delay: 1s;
    `,
  )}
`;
const Kitchen = (props) => {
  const id = useMemo(
    () => uuidv4(),
    [],
  );

  return (
    <Container
      transparent
      data-tooltip-id={id}
    >
      <Image width={370} height="auto" src={kitchenSrc} />
      <StyledTooltip
        id={id}
        isOpen
        floating
      >
        {/* <Image src={pasta} size={40} /> */}
        COOK HERE
      </StyledTooltip>
    </Container>
  );
};

Kitchen.propTypes = {
  title: PropTypes.string,
  hourly: PropTypes.number,
  type: PropTypes.string,
  beforeTax: PropTypes.number,
  afterTax: PropTypes.number,
  date: PropTypes.string, // ISO string
};

Kitchen.defaultProps = {
  title: 'title',
  hourly: 10000,
  type: 'monthly',
  beforeTax: 321000,
  afterTax: 321000,
  date: moment().toISOString(),
};

export default Kitchen;
