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

import {
  COffcanvas,
} from '@coreui/react';

import {
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

const GatesMain = (props) => {
  const { id } = useParams();
  const location = useLocation();
  const cookerId = id - 1;
  const [
    orderMonitorVisible,
    setOrderMonitorVisible,
  ] = useState(false);
  const [
    selectedOrderId,
    setSelectedOrderId,
  ] = useState(null);
  const {
    pot,
    ...others
  } = props;

  const potController = usePotController(cookerId);
  const {
    // data,
    // count,
    data,
    itemisedOrderList,
    // orderListCount: count,
    loading,
    error,
    refetch,
  } = useOrderData({
    // limit: pageSize,
    // offset: (queryParams.pageSize * (queryParams.page - 1)) || 0,
  });

  const {
    recipe,
    lastActionType,
    recipeRemainingTimeMs,
    recipeDurationMs,
    isCooking,
    isWashing,
    lastActionId,
    selectRecipe,
    selectedRecipeId,
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
  const selectedOrder = data.find((o) => Number(o.id) === Number(selectedOrderId)) || {};
  const selectedItemisedOrder = itemisedOrderList
    .filter((io) => io.orderNo === selectedOrder.orderNo);
  console.log(
    'selectedOrder: ',
    selectedOrderId,
    data,
    itemisedOrderList,
    selectedOrder,
    selectedItemisedOrder,
  );
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
          <OrderSelection
            order={selectedOrder}
            orderItems={selectedItemisedOrder}
            onClickOrderChange={() => setOrderMonitorVisible(true)}
            onClickOrderPrepare={(orderItem) => {
              selectRecipe(orderItem.orderKitchen.recipeId);
              // potController.prepAngle();
            }}
          />
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
      <COffcanvas
        visible={orderMonitorVisible}
        placement="start"
        backdrop
        onHide={() => setOrderMonitorVisible(false)}
        style={{
          width: 'auto',
          overflow: 'auto',
          backgroundColor: '#EEF0F3',
        }}
      >
        <Flex flex={0}>
          <Card padding={0}>
            <OrderMonitor
              pickCellRenderers={(cellRenderers) => {
                return cellRenderers.filter(({ dataIndex }) => {
                  return [
                  // 'id',
                    'orderNoUnique',
                    'orderNo',
                    'item',
                    'requestCustomer',
                    'dateTime',
                    'action',
                  ].indexOf(dataIndex) > -1;
                });
              }}
              onClickOrderItem={() => setOrderMonitorVisible(true)}
              onClickOrder={(oId) => {
                setSelectedOrderId(oId);
                setOrderMonitorVisible(false);
              }}
              pageSize={8}
              selectRecipe={selectRecipe}
            />
          </Card>
        </Flex>
      </COffcanvas>
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
