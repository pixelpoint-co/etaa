import {
  animated, useSpring,
} from 'react-spring';
import styled from 'styled-components';

import Text from '../../atoms/P';

const Animated = animated.span;

const SpringNumber = ({
  number,
  children,
  ...others
}) => {
  const { value } = useSpring({
    value: number,
    from: { value: 0 },
    config: { duration: 1000 },
  });

  return (
    <Text {...others}>
      <Animated>
        {value.interpolate((val) => Math.floor(val))}
      </Animated>
      {children}
    </Text>
  );
};

export default SpringNumber;
