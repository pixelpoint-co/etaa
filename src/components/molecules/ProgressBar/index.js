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
  border-radius: ${prop('size')}px;
  width: 100%;
  height: 100%;
  background-color: ${({
    containerColor,
    tone,
  }) => containerColor || palette(
    'grayscale',
    4,
  )};
`;

const Bar = styled(Flex)`
  flex: initial;
  transition: width 200ms ease-in-out, height 200ms ease-in-out;
  background-color: ${({
    color,
    tone,
  }) => color || palette(tone)};
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
  containerColor,
  containerStyle = {},
  barStyle = {},
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
        const parsedPercentage = percentage || 0;
        setProgress(`${parsedPercentage}%`);
      });
    },
    [percentage],
  );

  const progressStyle = direction === 'horizontal'
    ? {
      width: progress || 0,
      height: size,
    }
    : {
      height: progress || 0,
      width: size,
    };
  const containerDefaultStyle = direction === 'horizontal'
    ? { height: size }
    : { width: size };

  return (
    <Container
      style={{
        ...containerDefaultStyle,
        ...containerStyle,
      }}
      size={size}
      containerColor={containerColor}
    >
      <Bar
        style={{
          ...progressStyle,
          ...barStyle,
        }}
        direction={direction}
        size={size}
        {...others}
        color={color}
        containerColor={containerColor}
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
