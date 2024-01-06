import { useMediaQuery } from 'react-responsive';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  v4 as uuidv4,
} from 'uuid';
import { Tooltip } from 'react-tooltip';
import {
  useMemo, useState, useRef, useCallback, useEffect,
} from 'react';
import { ifProp } from 'styled-tools';
import { size } from 'styled-theme';
import {
  AnimatePresence, motion,
} from 'framer-motion';
import Image from '../../components/atoms/Image';
import kioskSrc from '../../assets/image/kiosk-on-overlay.png';
import kioskOffSrc from '../../assets/image/kiosk-off.png';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import theme from '../../theme';
import Icon from '../../components/atoms/Icon';
import ErrorPulse from '../../components/molecules/ErrorPulse';

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
  translate: -4% -4%;
  padding: 0px;
`;
const Overlay = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  opacity: ${ifProp(
    '$tempLoading',
    1,
    0,
  )};
  transition: 200ms ease-in-out opacity;
  &:hover {
    opacity: 1;
  }

`;
const Kiosk = (props) => {
  const {
    onClick,
    ...others
  } = props;
  const id = useMemo(
    () => uuidv4(),
    [],
  );
  const [
    tempLoading,
    setTempLoading,
  ] = useState(false);
  const loadingRef = useRef(null);

  const handleClick = useCallback(
    (e) => {
      setTempLoading(true);
      onClick(e);

      loadingRef.current = setTimeout(
        () => {
          setTempLoading(false);
        },
        800,
      );
    },
    [onClick],
  );

  useEffect(
    () => () => {
      clearTimeout(loadingRef.current);
    },
    [],
  );

  const isMobile = useMediaQuery({ query: `(max-width: ${theme.sizes.mobileBreakpoint})` });
  return (
    <Container
      transparent
      data-tooltip-id={id}
      theme="grayscale"
      {...props}
      onClick={handleClick}
    >
      <Image width={isMobile ? 165 : 330} height="auto" src={kioskOffSrc} />
      <Overlay $tempLoading={tempLoading}>
        <Image width={isMobile ? 165 : 330} height="auto" src={kioskSrc} />
      </Overlay>
      <StyledTooltip
        id={id}
        isOpen
        floating
      >
        {tempLoading ? (
          <Icon icon="loader" palette="white" />
        ) : 'order here'}
      </StyledTooltip>
    </Container>
  );
};

Kiosk.propTypes = {};

Kiosk.defaultProps = {};

export default Kiosk;
