// import { connect } from 'react-redux';
import {
  useLocation, useParams,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import _, {
  get,
} from 'lodash';
import {
  ifProp,
  palette,
} from 'styled-tools';

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { size } from 'styled-theme';
import Flex from '../../components/atoms/Flex';
import Heading from '../../components/atoms/Heading';
import Card from '../../components/atoms/Card';
import ProgressTimer from '../../components/molecules/ProgressTimer';

import theme from '../../theme';
import AsanaSupport from '../AsanaSupport';
import usePotController from '../../hooks/usePotController';

const Wrapper = styled(Flex)`
  flex-direction: row;
  flex-grow: 0;
  flex-basis: 100%;
  overflow: auto;
  align-items: center;
  position: relative;
`;

const PotNumber = styled(Heading)`
  font-size: 45px;
  line-height: 45px;
  font-weight: 700;
  margin-left: 15px;

  @media (max-width: ${size('mobileBreakpoint')}) {
    /* position: absolute; */
    /* left: 12px; */
    margin-left: 0px;
    font-size: 30px;
    line-height: 30px;
  }
`;

const TimerSection = styled(Card)`
  margin-left: 50px;
  @media (max-width: ${size('mobileBreakpoint')}) {
    margin-left: 10px;
    /* padding-left: 50px; */
  }
  background-color: ${ifProp(
    '$needTaste',
    palette(
      'grayscale',
      0,
    ),
    palette(
      'grayscale',
      4,
    ),
  )};
  border-color: ${ifProp(
    '$needTaste',
    palette(
      'grayscale',
      0,
    ),
    palette(
      'grayscale',
      4,
    ),
  )};
  padding: 10px 20px;
`;
const Column = styled(Card)`
  margin: 0px 10px;
  padding: 10px;
  max-height: 580px;
  min-height: 100%;
  flex-basis: 150px;
  overflow: auto;
`;
const COOKER_LOCATION = process.env.REACT_APP_LOCATION;

const PotTimer = (props) => {
  const {
    cookerId,
    ...others
  } = props;
  const potController = usePotController(cookerId);
  const {
    currentRecipe,
    currentRecipeId,
    lastActionType,
    washingRemainingTimeMs,
    recipeRemainingTimeMs,
    recipeDurationMs,
    isCooking,
    isWashing,
    lastActionId,
  } = potController;

  const [
    needTaste,
    setNeedTaste,
  ] = useState(false);
  const timerColorProps = { containerBarColor: theme.palette.grayscale[3] };
  const timerColorAlertProps = {
    timerBarColor: theme.palette.red[0],
    containerBarColor: theme.palette.grayscale[3],
    timeColor: theme.palette.red[0],
    labelColor: theme.palette.white[0],
  };

  let recipeName = '';
  if (isWashing) recipeName = '세척 중';
  if (isCooking && currentRecipeId === 21) recipeName = '추가 조리';
  if (isCooking && currentRecipeId !== 21) recipeName = currentRecipe?.name;
  if (lastActionType === 'abort') recipeName = '정지중';
  if (lastActionType === 'machine') recipeName = lastActionId;
  const handleCountUpdate = useCallback(
    (count) => {
      if (count && count < 90 && isCooking) {
        return setNeedTaste(true);
      }
      return setNeedTaste(false);
    },
    [isCooking],
  );
  useEffect(
    () => {
      handleCountUpdate(0);
    },
    [
      cookerId,
      handleCountUpdate,
    ],
  );
  return (
    <Wrapper {...others}>
      <PotNumber>
        {_.padStart(
          cookerId + 1,
          2,
          '0',
        )}
      </PotNumber>
      <TimerSection
        palette="grayscale"
        tone={4}
        $needTaste={needTaste}
      >
        <ProgressTimer
          label={recipeName}
          duration={isWashing ? washingRemainingTimeMs : recipeRemainingTimeMs}
          totalDuration={isWashing ? 111000 : recipeDurationMs}
          onComplete={() => handleCountUpdate(0)}
          onCount={(v) => handleCountUpdate(v)}
          {...(needTaste ? timerColorAlertProps : timerColorProps)}
        />
      </TimerSection>
    </Wrapper>
  );
};

PotTimer.propTypes = {
  pot: PropTypes.shape({
    number: PropTypes.number,
    label: PropTypes.string,
  }),
};
PotTimer.defaultProps = {
  pot: {
    number: 1,
    label: 'pot-label',
  },
};

export default PotTimer;
