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
  useMemo,
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
import MenuSelect from '../../components/organisms/PotController/MenuSelect';
import useRecipeData from '../../hooks/useRecipeData';
import {
  recipeTags,
} from '../../constants/pot';

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

const Column = styled(Card)`
  margin: 0px 10px;
  padding: 10px;
  max-height: 580px;
  min-height: 100%;
  flex-basis: 150px;
  overflow: auto;
`;
const MenuSelectContainer = styled(Flex)`
  flex: 1;
  flex-direction: column;
  // min-height: 90vh;
  // max-height: 90vh;
  // min-width: 40vw;
  // max-width: 40vw;
`;
const ButtonContainer = styled(Flex)`
  flex-direction: row;
  justify-content: stretch;
  flex: 0;
  margin: 0 -10px;
  margin-top: 20px;
`;
const SelectButton = styled(Button)`
  flex: 1;
  margin: 0 10px;
`;
const MenuOptionsSelectContainer = styled(Flex)`
  margin: 0px -10px;
  flex-direction: column;
  flex-wrap: nowrap;
`;
const MenuGroupContainer = styled(Column)`
  flex: 1 0 50px;
`;
const MenuListContainer = styled(Column)`
  flex: 2 0 150px;
`;

const OffC = (props) => {
  const {
    selectedOrder,
    selectedItemisedOrder,
    chefMonitoringData,
    selectRecipe,
    ...others
  } = props;
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams();
  return (
    <COffcanvas
      visible={queryParams.orderId > 0}
      placement="start"
      backdrop={false}
      onHide={() => setQueryParams(({
        orderId,
        ...rest
      }) => rest)}
      style={{
        width: '852px',
        marginTop: '94px',
        marginBottom: '14px',
        overflow: 'auto',
        backgroundColor: '#EEF0F3',
        border: 'none',
      }}
    >
      <Flex flex={0}>
        <Card padding={0}>
          <OrderSelection
            order={selectedOrder}
            orderItems={selectedItemisedOrder}
            chefMonitoringData={chefMonitoringData}
            onClickOrderChange={() => setQueryParams(({
              orderId,
              ...rest
            }) => rest)}
            onClickOrderPrepare={(orderKitchen) => {
              selectRecipe(
                orderKitchen.recipeId,
                orderKitchen.id,
              );
            }}
          />
        </Card>
      </Flex>
    </COffcanvas>
  );
};
const GatesMain = (props) => {
  const { id } = useParams();
  const location = useLocation();
  const isReceipt = JSON.parse(process.env.REACT_APP_RECEIPT.toLowerCase());
  const cookerId = id - 1;
  // const [
  //   orderMonitorVisible,
  //   setOrderMonitorVisible,
  // ] = useState(false);
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams();
  const { orderId: selectedOrderId } = queryParams;

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
    selectRecipe,
    orderRefetchTime,
    updateOrderKitchenStatus,
    orderKitchenRefetchTime,
    potMonitoringData,
    chefMonitoringData,
    cherMonitorPot,
    chefMonitorPotList,
    setInductionPower,
  } = potController;
  const {
    data,
    itemisedOrderList,
  } = useOrderData({
    orderRefetchTime,
    chefMonitoringData,
    cherMonitorPot,
    chefMonitorPotList,
    orderKitchenRefetchTime,
  });
  const {
    data: recipeData,
    error,
    loading,
  } = useRecipeData();

  const [
    needTaste,
    setNeedTaste,
  ] = useState(false);
  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] = useState(130);
  const [
    selectedRecipeId,
    setSelectedRecipeId,
  ] = useState(null);
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
  const selectedOrder = data.find((o) => Number(o.id) === Number(selectedOrderId)) || {};
  const selectedItemisedOrder = itemisedOrderList
    .filter((io) => get(
      io,
      [
        'order',
        'id',
      ],
    ) === Number(selectedOrderId));
  const handleCountUpdate = (count) => {
    if (count && count < 90 && isCooking) {
      return setNeedTaste(true);
    }
    return setNeedTaste(false);
  };

  const secondaryOptions = useMemo(
    () => {
      const selectedRecipeList = _.filter(
        recipeData,
      );

      const recipeList = selectedRecipeList
        .filter((v) => v != null)
        .map((v) => ({
          ...v,
          label: v.name,
          value: v.id,
        }));

      return recipeList;
    },
    [
      recipeData,
      selectedCategoryId,
    ],
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
        {/* <ActivateButton>
          button
        </ActivateButton> */}
      </HeaderSection>
      <BodySection>

        {
          isReceipt ? (
            <BodyColumn flex={1} shrink={0} grow={0} basis={720} direction="column">
              <OrderMonitor
                onClickOrder={(order) => {
                  setQueryParams((old) => ({
                    ...old,
                    orderId: order.orderId,
                  }));
                }}
                selectedChannelNo={selectedOrder.channelNo}
                pageSize={8}
                selectRecipe={selectRecipe}
              />
            </BodyColumn>
          ) : (
            <>
              <BodyColumn>
                <MenuSelectContainer>
                  <MenuOptionsSelectContainer>
                    {/* <MenuGroupContainer>
                <MenuSelect
                  value={selectedCategoryId}
                  options={recipeTags.filter((tag) => tag.viewable === true)}
                  onSelect={(value) => {
                    setSelectedCategoryId(value);
                    if (value !== selectedCategoryId) {
                      setSelectedRecipeId(null);
                    }
                  }}
                  buttonOffTheme={{
                    tone: 3,
                    themeType: 'text',
                  }}
                  buttonStyle={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    lineHeight: '20px',
                  }}
                />
              </MenuGroupContainer> */}
                    <MenuListContainer>
                      <MenuSelect
                        value={selectedRecipeId}
                        onSelect={(v) => setSelectedRecipeId(v)}
                        options={secondaryOptions}
                        buttonTheme={{
                          themeType: 'outline',
                          tone: 2,
                        }}
                        buttonOffTheme={{
                          themeType: 'text',
                          tone: 3,
                        }}
                      />
                    </MenuListContainer>
                  </MenuOptionsSelectContainer>

                  <ButtonContainer>
                    <SelectButton
                      label="선택"
                      disabled={selectedRecipeId == null}
                      onClick={() => {
                        selectRecipe(selectedRecipeId);
                      }}
                    />
                  </ButtonContainer>
                </MenuSelectContainer>
              </BodyColumn>
              <BodyColumn flex={1} shrink={0} grow={0} basis={320} gap={20} direction="row">
                <InductionController
                  power={potController.stoves[0].power}
                />
                <InductionController
                  power={potController.stoves[1].power}
                />
              </BodyColumn>
            </>

          )
        }

        <BodyColumn flex={0} shrink={0} grow={1} basis={10} direction="column">
          <PotController
            potController={potController}
            cookerId={cookerId}
          />
        </BodyColumn>
      </BodySection>
      <OffC
        selectedOrder={selectedOrder}
        selectedItemisedOrder={selectedItemisedOrder}
        chefMonitoringData={chefMonitoringData}
        selectRecipe={selectRecipe}
      />
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
