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
import {
  findLast,
  get,
} from 'lodash';
import {
  useEffect,
  useState,
} from 'react';
import {
  gql, useQuery, useSubscription,
} from '@apollo/client';
import {
  ifNotProp,
  ifProp,
} from 'styled-tools';
import moment from 'moment';
import IconButton from '../../molecules/IconButton';
import Input from '../../molecules/Input';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';
import Image from '../../atoms/Image';
import Card from '../../atoms/Card';

import potImageSrc from '../../../assets/image/pot.png';
import ProgressBar from '../../molecules/ProgressBar';
import ProgressTimer from '../../molecules/ProgressTimer';
import Icon from '../../atoms/Icon';
import ErrorPulse from '../../molecules/ErrorPulse';
import Button from '../../atoms/Button';
import usePotController from '../../../hooks/usePotController';
import PotWash from '../../atoms/PotWash';

const Wrapper = styled(Card)`
  padding: 20px;
  justify-content: flex-end;
  position: relative;
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
  position: relative;
  flex: 0;
  margin: 5px auto 0px auto;
  align-self: stretch;
  width: 100%;
  justify-content: center;
`;
const ImageContainer = styled(Flex)`
  margin: 0px 20px 0px 20px;
  flex: 0;
  flex-basis: 40%;
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
  opacity: 0.7;
  transform: translate(-50%,-50%) rotateX(65deg);


  svg {
    opacity: 1;
    transition: opacity 250ms ease-in-out;
    animation: spin 5000ms linear infinite;
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
`;

const PotUnit = (props) => {
  const {
    maxTemperature,
    cookerId,
    // stoves,
    order,
    // recipe,
    rotate,
    error,
    ...others
  } = props;

  const potController = usePotController(
    cookerId,
    {},
  );

  const {
    // cookerMonitoringError,
    // cookerMonitoringData,
    // cookerMonitoringUUID,
    // subscriptionTime,

    // potMonitoringData,
    recipe,
    recipeRemainingTimeMs,
    recipeDurationMs,
    // recipeDuration,
    // recipeEllapsedTimeMs,
    // recipeEllapsedTime,

    stoves,
    isRotating,
    isWashing,
    isCooking,

    lastActionType,
    lastActionId,
    // recordList,
    // parsedRecordList,
  } = potController;
  console.log(
    'potController ',
    potController,
  );
  const orderName = null;
  const recipeId = get(
    recipe,
    'id',
    null,
  );
  let recipeName = '';
  if (isWashing) recipeName = '세척 중';
  if (isCooking && recipeId === 21) recipeName = '추가 조리';
  if (lastActionType === 'abort') recipeName = '정지중';
  if (lastActionType === 'machine') recipeName = lastActionId;

  const taskName = null;
  console.log(
    lastActionType,
    lastActionId,
  );
  return (
    <Wrapper {...others} hasError={!!error}>
      <Content>
        <Text>{lastActionType}</Text>
        <PotSection>
          <ProgressBar
            direction="vertical"
            size={8}
            percentage={get(
              stoves,
              [
                0,
                'temperature',
              ],
              0,
            )}
            palette="orange"
          />
          <ImageContainer>
            {isWashing ? (
              <PotWash />
            ) : (
              <StyledImage
                src={potImageSrc}
              />
            )}
          </ImageContainer>

          <Rotate
            $rotate={isRotating}
          >
            <Icon
              icon="potRotateStraight"
              size={44}
              fill="white"
            />
          </Rotate>
          <ProgressBar
            direction="vertical"
            size={8}
            percentage={get(
              stoves,
              [
                1,
                'temperature',
              ],
              0,
            )}
            palette="orange"
          />
        </PotSection>
        <OrderRecipeSection>
          <OrderName>
            {order.id}
          </OrderName>
          <ProgressTimerContainer>
            <ProgressTimer
              label={recipeName}
              duration={recipeRemainingTimeMs}
              totalDuration={(isWashing || lastActionType === 'machine') ? Infinity : recipeDurationMs}
            />
          </ProgressTimerContainer>
        </OrderRecipeSection>
      </Content>
      <PotNumber>{cookerId + 1}</PotNumber>
      <ErrorPulseSection hasError={!!error}>
        <ErrorPulse />
      </ErrorPulseSection>
    </Wrapper>
  );
};

PotUnit.propTypes = {
  rotate: PropTypes.bool,
  cookerId: PropTypes.number,
  maxTemperature: PropTypes.number,
  stoves: PropTypes.arrayOf(PropTypes.shape({
    temperature: PropTypes.number,
    status: PropTypes.oneOf([
      'on',
      'off',
    ]),
  })),
  order: PropTypes.shape({ id: PropTypes.number }),
  recipe: PropTypes.shape({
    id: PropTypes.number,
    duration: PropTypes.number,
    name: PropTypes.string,
  }),
};

PotUnit.defaultProps = {
  rotate: false,
  maxTemperature: 350,
  cookerId: null,
  stoves: [
    {
      status: 'on',
      temperature: 0,
    },
    {
      status: 'on',
      temperature: 0,
    },
  ],
  order: {
    id: null,
    recipeList: [
      1,
      2,
    ],
  },
  recipe: {
    id: null,
    duration: 60,
    name: '레시피이름',
  },
};

export default PotUnit;
