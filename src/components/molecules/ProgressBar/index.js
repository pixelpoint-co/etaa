import {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  ifProp,
  palette,
  prop,
  switchProp,
} from 'styled-tools';

import Flex from '../../atoms/Flex';
import theme from '../../../theme';

const Container = styled(Flex)`
  flex: initial;
  background-color: ${palette(
    'grayscale',
    5,
  )};
  border-radius: ${prop('size')}px;
  width: 100%;
  height: 100%;
`;

const Bar = styled(Flex)`
  flex: initial;
  transition: width, height 200ms ease-in;
  background-color: ${({ tone }) => palette(tone)};
  align-self: ${switchProp(
    'direction',
    {
      horizontal: 'flex-start',
      vertical: 'flex-end',
    },
  )};
  border-radius: ${prop('size')}px;
`;

const ProgressBar = ({
  color,
  percentage,
  size = 3,
  direction,
  ...others
}) => {
  const [
    progress,
    setProgress,
  ] = useState(0);

  useEffect(
    () => {
      requestAnimationFrame(() => {
        setProgress(`${percentage}%`);
      });
    },
    [percentage],
  );

  const progressStyle = direction === 'horizontal'
    ? {
      width: progress,
      height: size,
    }
    : {
      height: progress,
      width: size,
    };
  const containerStyle = direction === 'horizontal'
    ? { height: size }
    : { width: size };

  return (
    <Container
      style={containerStyle}
      size={size}
    >
      <Bar
        style={{ ...progressStyle }}
        direction={direction}
        size={size}
        {...others}
      />
    </Container>
  );
};

ProgressBar.propTypes = {
  size: PropTypes.number,
  percentage: PropTypes.number,
  direction: PropTypes.oneOf([
    'vertical',
    'horizontal',
  ]),
  palette: PropTypes.string,
  tone: PropTypes.number,
};

ProgressBar.defaultProps = {
  size: 5,
  percentage: 50,
  direction: 'horizontal',
  palette: 'primary',
  tone: 0,
};

export default ProgressBar;
