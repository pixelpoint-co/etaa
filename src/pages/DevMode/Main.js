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
  size,
} from 'styled-theme';
import {
  ifProp,
  palette,
} from 'styled-tools';

import {
  COffcanvas,
} from '@coreui/react';

import {
  useEffect,
  useState,
} from 'react';
import Text from '../../components/atoms/P';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import Heading from '../../components/atoms/Heading';
import Card from '../../components/atoms/Card';
import AntDList from '../../components/organisms/AntDList';
import PotUnit from '../../components/organisms/PotUnit';
import ProgressTimer from '../../components/molecules/ProgressTimer';
import Label from '../../components/atoms/Label';

import PotControlButton from '../../components/organisms/PotControlButton';
import PotController from '../../components/organisms/PotController';
import usePotController from '../../hooks/usePotController';
import useOrderData from '../../hooks/useOrderData';
import OrderSelection from '../../components/organisms/OrderSelection';
import theme from '../../theme';
import OrderMonitor from '../../containers/OrderMonitor';
import useQueryParams from '../../hooks/useQueryParams';
import InductionController from '../../components/organisms/InductionController';
import Select from '../../components/molecules/Select';

const Wrapper = styled(Flex)`
  flex-direction: column;
  flex-grow: 0;
  flex-basis: 100%;
  overflow: auto;
  align-items: stretch;
  padding: 15px;
`;
const HeaderSection = styled(Flex)`
  align-items: center;
  flex: 0;
`;

const PotNumber = styled(Heading)`
  font-size: 45px;
  line-height: 45px;
  font-weight: 700;
  margin-left: 15px;
`;

const TimerSection = styled(Card)`
  margin-left: 55px;
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
const BodySection = styled(Flex)`
  flex-direction: row;
  margin: 15px -8px 0px -8px;
  flex-basis: 100%;
  flex-grow: 0;
  overflow: hidden;
`;
const BodyColumn = styled(Flex)`
  margin: 0px 8px;
  overflow: hidden;
`;
const PotControlButtonContainer = styled(Flex)`
  flex-basis: 50%;
  padding: 8px;
`;

const ActivateButton = styled(Button)`
  margin-left: 15px;
`;

const OrderListCard = styled(Card)`
`;

const OrderListSection = styled(Card)`
  background-color: ${palette(
    'grayscale',
    4,
  )};
  padding: 10px 20px;
`;
const PotGridContainer = styled(Flex)`
  margin: -10px 0px;
  flex-wrap: wrap;
  flex: 0;
  flex-basis: 640px;
`;
const DevModeMain = (props) => {
  const location = useLocation();
  // const [
  //   orderMonitorVisible,
  //   setOrderMonitorVisible,
  // ] = useState(false);
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams({ initialQueryParams: { id: 0 } });
  const { id } = queryParams;
  const cookerId = id - 1;
  // const [
  //   selectedOrderId,
  //   setSelectedOrderId,
  // ] = useState(null);
  const {
    pot,
    ...others
  } = props;

  const potController = usePotController(cookerId);
  const {
    currentRecipe,
    currentRecipeId,
    lastActionType,
    recipeRemainingTimeMs,
    recipeDurationMs,
    isCooking,
    isWashing,
    lastActionId,
    setInductionPower,
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

  const handleCountUpdate = (count) => {
    if (count && count < 90 && isCooking) {
      return setNeedTaste(true);
    }
    return setNeedTaste(false);
  };
  return (
    <Wrapper>
      <HeaderSection>
        <PotNumber>
          {_.padStart(
            id,
            2,
            '0',
          )}
        </PotNumber>
        <Select
          items={[
            1,
            2,
            3,
            4,
            5,
          ]}
          style={{ marginBottom: 20 }}
          value={id}
          onChange={(v) => setQueryParams((prev) => ({
            ...prev,
            id: v,
          }))}
        />
        <TimerSection
          palette="grayscale"
          tone={4}
          $needTaste={needTaste}
        >
          <ProgressTimer
            label={recipeName}
            duration={recipeRemainingTimeMs}
            totalDuration={isWashing ? Infinity : recipeDurationMs}
            onComplete={() => handleCountUpdate(0)}
            onCount={(v) => handleCountUpdate(v)}
            {...(needTaste ? timerColorAlertProps : timerColorProps)}
          />
        </TimerSection>
      </HeaderSection>
      <BodySection>
        <BodyColumn flex={1} shrink={0} grow={0} basis={320} gap={20} direction="row">
          <InductionController
            power={potController.stoves[0].power}
            onChange={(power) => setInductionPower(
              power,
              0,
            )}
          />
          <InductionController
            power={potController.stoves[1].power}
            onChange={(power) => setInductionPower(
              power,
              1,
            )}
          />
        </BodyColumn>
        <BodyColumn flex={0} shrink={0} grow={1} basis={400} direction="column">
          <PotController
            potController={potController}
            cookerId={cookerId}
          />
        </BodyColumn>
      </BodySection>
    </Wrapper>
  );
};

DevModeMain.propTypes = {
  pot: PropTypes.shape({
    number: PropTypes.number,
    label: PropTypes.string,
  }),
};
DevModeMain.defaultProps = {
  pot: {
    number: 1,
    label: 'pot-label',
  },
};

export default DevModeMain;
