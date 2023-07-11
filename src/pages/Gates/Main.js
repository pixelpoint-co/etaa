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
  palette,
} from 'styled-tools';

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
import theme from '../../theme';
import OrderMonitor from '../../containers/OrderMonitor';

const Wrapper = styled(Flex)`
  flex-direction: column;
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
  background-color: ${palette(
    'grayscale',
    4,
  )};
  padding: 10px 20px;
`;
const BodySection = styled(Flex)`
  flex-direction: row;
  margin: 15px -8px 0px -8px;
`;
const BodyColumn = styled(Flex)`
  margin: 0px 8px;
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
const PotGridContainer = styled(Flex)`
  margin: -10px 0px;
  flex-wrap: wrap;
  flex: 0;
  flex-basis: 640px;
`;

const GatesMain = (props) => {
  const { id } = useParams();
  const location = useLocation();
  const cookerId = id - 1;

  const {
    pot,
    ...others
  } = props;

  const potController = usePotController(cookerId);
  const {
    recipe,
    lastActionType,
    recipeRemainingTimeMs,
    recipeDurationMs,
    isCooking,
    isWashing,
    lastActionId,
    selectRecipe,
  } = potController;
  const recipeId = get(
    recipe,
    'id',
  );
  let recipeName = '';
  if (isWashing) recipeName = '세척 중';
  if (isCooking && recipeId === 21) recipeName = '추가 조리';
  if (isCooking && recipeId !== 21) recipeName = recipe.name;
  if (lastActionType === 'abort') recipeName = '정지중';
  if (lastActionType === 'machine') recipeName = lastActionId;
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
        <TimerSection palette="grayscale" tone={4}>
          <ProgressTimer
            label={recipeName}
            duration={recipeRemainingTimeMs}
            totalDuration={isWashing ? Infinity : recipeDurationMs}
            containerBarColor={theme.palette.grayscale[3]}
          />
        </TimerSection>
        {/* <ActivateButton>
          button
        </ActivateButton> */}
      </HeaderSection>
      <BodySection>
        <BodyColumn flex={1.1} direction="column">
          <Flex flex={0}>
            <OrderMonitor
              pickCellRenderers={(cellRenderers) => {
                return cellRenderers.filter(({ dataIndex }) => {
                  return [
                    'id',
                    'orderNoUnique',
                    'item',
                    'requestCustomer',
                    'dateTime',
                    'action',
                  ].indexOf(dataIndex) > -1;
                });
              }}
              pageSize={10}
              selectRecipe={selectRecipe}
            />
          </Flex>
          {/* <OrderListCard>
            <AntDList
              RowComponent={() => <div>some-row</div>}
              dataSource={_.times(10)}
            />

          </OrderListCard> */}
        </BodyColumn>
        {/* <BodyColumn flex={1}>
          <Card>Receipt</Card>
        </BodyColumn> */}
        <BodyColumn>
          <PotController
            potController={potController}
            cookerId={cookerId}
          />
        </BodyColumn>
      </BodySection>
    </Wrapper>
  );
};

GatesMain.propTypes = {
  pot: PropTypes.shape({
    number: PropTypes.number,
    label: PropTypes.string,
  }),
};
GatesMain.defaultProps = {
  pot: {
    number: 1,
    label: 'pot-label',
  },
};

export default GatesMain;
