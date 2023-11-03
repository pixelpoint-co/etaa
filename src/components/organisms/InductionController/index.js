import styled, {
  css,
} from 'styled-components';
import PropTypes from 'prop-types';
import {
  palette, size,
} from 'styled-theme';
import {
  v4 as uuidv4,
} from 'uuid';
import _, {
  findLast,
  get,
} from 'lodash';
import {
  useEffect,
  useState,
} from 'react';

import {
  ifNotProp,
  ifProp,
} from 'styled-tools';
import moment from 'moment';
import {
  useSpring, animated,
} from 'react-spring';

import IconButton from '../../molecules/IconButton';
import Input from '../../molecules/Input';
import Flex from '../../atoms/Flex';
import Text, {
  defaultStyle as textStyle,
} from '../../atoms/P';
import Image from '../../atoms/Image';
import DegreeImage from '../../atoms/DegreeImage';
import Card from '../../atoms/Card';

import potImageSrc from '../../../assets/image/pot.png';
import ProgressBar from '../../molecules/ProgressBar';
import ProgressTimer from '../../molecules/ProgressTimer';
import SpringNumber from '../../molecules/SpringNumber';
import Icon from '../../atoms/Icon';
import ErrorPulse from '../../molecules/ErrorPulse';
import Button from '../../atoms/Button';
import usePotController from '../../../hooks/usePotController';
import PotWash from '../../atoms/PotWash';
import theme from '../../../theme';

const Wrapper = styled(Card)`
  padding: 20px;
  position: relative;
  overflow: hidden;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
`;
const PotNumber = styled(Text)`
  padding: 20px;

  font-size: 22px;
  line-height: 22px;

  font-weight: bold;
  position: absolute;
  top: 0;
  left: 0;
`;
const PotDegree = styled(SpringNumber)`
  position: absolute;
  top: 0;
  left: 0;
`;
const Content = styled(Flex)`
  position: relative;
  flex-direction: column;
  flex: 0;
`;
const ErrorPulseSection = styled(Flex)`
  position: absolute;
  z-index: 1;
  right: 4px;
  top: 4px;

  ${ifNotProp(
    'hasError',
    css`
      display: none;
    `,
  )}
`;
const PotSection = styled(Flex)`
  flex: 0;
  position: relative;
  justify-content: center;
  margin: -5px 0px;
`;
const ButtonSection = styled(Flex)`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
  position: relative;
  justify-content: center;
`;

const DegreeContainer = styled(Flex)`
  position: abso
  left: 50%;
  const PotSection = styled(Flex)>
  {_}
  top: 0%;
`;
const StyledSpringNumber = styled(SpringNumber)`
  font-size: 14px;
  line-height: 14px;
  margin-top: 6px;
  font-weight: bold;
`;
const ImageContainer = styled(Flex)`
  margin: 0px 20px 0px 20px;
  flex: 0;
  flex-basis: 40%;
  min-width: 60px;
  max-width: 120px;
`;
const StyledImage = styled(Image)`
`;
const OrderRecipeSection = styled(Flex)`
  flex-direction: column;
  margin-top: 18px;
`;
const OrderName = styled(Text)`
  color: ${palette(
    'grayscale',
    2,
  )};
  font-size: 18px;
  line-height: 18px;
`;
const ProgressTimerContainer = styled(Flex)`
  margin-top: 8px;
`;
const Rotate = styled(Flex)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%) rotateX(65deg);
    ${ifProp(
    '$reverse',
    css`transform: rotateX(180deg);`,
  )}
  svg {
    opacity: 1;
    transition: opacity 250ms ease-in-out;
    animation: spin 5000ms linear infinite;
    ${ifProp(
    '$reverse',
    css`animation: reverse-spin 5000ms linear infinite;`,
  )}
  }
  ${ifNotProp(
    '$rotate',
    css`
      svg {
        opacity: 0;
        animation: none;
      }
    `,
  )}

  @keyframes spin {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
  @keyframes reverse-spin {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(-360deg);
    }
  }
`;

const inductionPowerToTemp = (power, max = 7) => {
  const perPower = Math.ceil((100 / max) * 100) / 100;
  return Math.min(
    perPower * power,
    100,
  );
};

const InductionController = (props) => {
  const {
    cookerId,
    power,
    status,
    position,
    error,
    onChange,
    value,
    ...others
  } = props;

  return (
    <Wrapper {...others} hasError={!!error}>
      <PotSection>
        <ProgressBar
          direction="vertical"
          size={20}
          percentage={inductionPowerToTemp(
            power === 0 ? 0 : power + 1,
            9,
          )}
          palette="orange"
          containerColor="black"
          containerStyle={{ padding: 5 }}
        />
      </PotSection>
      <ButtonSection>
        {_.times(9).reverse().map((power) => (
          <Button
            key={power}
            style={{ width: '100%' }}
            palette="grayscale"
            onClick={(e) => onChange(power)}
            tone={4}
          >
            {power}
            {/* {power === 5 ? '강' : null}
            {power === 4 ? '중' : null}
            {power === 2 ? '약' : null} */}
          </Button>
        ))}
      </ButtonSection>
    </Wrapper>
  );
};

InductionController.propTypes = {
  power: PropTypes.number,
  status: PropTypes.oneOf([
    'on',
    'off',
  ]),
  position: PropTypes.string,
  onChange: PropTypes.func,
};

InductionController.defaultProps = {
  status: 'on',
  power: 0,
  position: 'L',
  onChange: () => {},
};

export default InductionController;
