import {
  useState,
} from 'react';
import {
  useSpring, animated,
} from 'react-spring';

import styled, {
  ThemeProvider, css,
} from 'styled-components';
import convert from 'color-convert';

import {
  ifProp,
  prop,
} from 'styled-tools';
import Flex from '../../atoms/Flex';
import Button, {
  defaultStyle,
  themeColor,
  themeSvg,
  unsetStyle,
  themeStyle,
} from '../../atoms/Button';
import Icon from '../../atoms/Icon';
import Text from '../../atoms/P';

import useTheme from '../../../hooks/useTheme';

const AnimatedButton = animated.button;

const StyledButton = styled(AnimatedButton)`
  ${defaultStyle}
  background-color: white;
  position: relative;
  flex: 0;
  border-radius: 50px;
`;

const BorderFrame = styled(Flex)`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-width: 2px;
  border-radius: 50px;
  border-color: ${prop('theme.componentTheme.background')};
  border-style: solid;
  pointer-events: none;

  /* transition: border-color:  */

  ${ifProp(
    'on',
    css`
  border-color: ${prop('theme.componentTheme.background')};

  `,
  )}
`;
const Container = styled(Flex)`
  overflow: hidden;
  border-radius: 50px;
  padding-right: ${prop('$size')}px;
`;
const AlertIcon = styled(Icon)`
  /* transform: translateX(-50%); */
`;
const AnimtedContainer = animated.div;
const StyledAnimtedContainer = styled(AnimtedContainer)`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  position: relative;
  background: blue;
`;
const StyledText = styled(Text)`
  ${themeColor}
`;
const OffContainer = styled(Flex)`
  position: absolute;
  width: 100%;
  height: 100%;
  right: 100%;
  color: inherit;
  background-color: red;
`;
const OffLabel = styled(Text)`
  color: ${prop('theme.componentTheme.background')};
`;

const SwitchButton = (props) => {
  const [
    isOn,
    setIsOn,
  ] = useState(false);
  const {
    // isOn,
    size = 60,
    loading,
    children,
    label,
    offLabel,
    ...others
  } = props;
  const componentTheme = useTheme(others);
  const foregroundRgb = convert.hex.rgb(componentTheme.foreground);
  const backgroundRgb = convert.hex.rgb(componentTheme.background);
  const {
    left,
    themeColorR,
    themeColorG,
    themeColorB,
    reverseColorR,
    reverseColorG,
    reverseColorB,
  } = useSpring({
    left: isOn ? '100%' : (loading ? '10%' : '0%'),
    themeColorR: isOn ? foregroundRgb[0] : backgroundRgb[0],
    themeColorG: isOn ? foregroundRgb[1] : backgroundRgb[1],
    themeColorB: isOn ? foregroundRgb[2] : backgroundRgb[2],
    reverseColorR: isOn ? backgroundRgb[0] : foregroundRgb[0],
    reverseColorG: isOn ? backgroundRgb[1] : foregroundRgb[1],
    reverseColorB: isOn ? backgroundRgb[2] : foregroundRgb[2],
  });

  const animatedStyle = { backgroundColor: `rgb(${themeColorR}, ${themeColorG}, ${themeColorB})` };
  const animatedStyleReverse = { backgroundColor: `rgb(${reverseColorR}, ${reverseColorG}, ${reverseColorB})` };
  const animatedPosition = { left };
  return (
    <ThemeProvider theme={(orig) => ({
      ...orig,
      componentTheme,
    })}
    >
      <StyledButton
        {...others}
        style={animatedStyle}
        onClick={() => setIsOn(!isOn)}
      >
        <Container $size={size}>
          <StyledAnimtedContainer
            style={animatedPosition}
          >
            <OffContainer>
              <StyledText>
                hello {String(isOn)}
              </StyledText>
            </OffContainer>
            <AlertIcon icon="alert" fill="white" size={size} />
            <StyledText>
              hello {String(isOn)}
            </StyledText>
          </StyledAnimtedContainer>
        </Container>
        <BorderFrame />
      </StyledButton>
    </ThemeProvider>

  );
};

export default SwitchButton;

// const AnimatedComponent = () => {
//   const [step, setStep] = React.useState(0);

//   const springProps = useSpring({
//     leftPercentage: isOn ? 100 : 0,

//     width: step === 0 ? '100px' : step === 1 ? '200px' : '300px',
//     backgroundColor: step === 0 ? 'red' : step === 1 ? 'blue' : 'green',
//   });

//   const handleClick = () => {
//     setStep((prevStep) => (prevStep + 1) % 3);
//   };

//   return (
//     <div>
//       <animated.div
//         style={{
//           ...springProps,
//           height: '50px',
//           margin: '20px',
//         }}
//       />
//       <button onClick={handleClick}>Next Step</button>
//     </div>
//   );
// };

// export default AnimatedComponent;
