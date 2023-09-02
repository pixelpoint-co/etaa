// import { connect } from 'react-redux';
import {
  useLocation,
} from 'react-router-dom';

import styled from 'styled-components';
import _ from 'lodash';
import {
  size,
} from 'styled-theme';
import {
  palette,
} from 'styled-tools';

import {
  Menu, Space,
} from 'antd';
import {
  useLayoutEffect, useRef,
} from 'react';
import moment from 'moment';
import Text from '../../components/atoms/P';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import Heading from '../../components/atoms/Heading';
import Card from '../../components/atoms/Card';
import useChefMonitor from '../../hooks/useChefMonitor';
import Ripped from '../../components/molecules/Ripped';
import useOrderData from '../../hooks/useOrderData';
import Icon from '../../components/atoms/Icon';
import PlatformImage from '../../components/atoms/PlatformImage';
import Tag from '../../components/atoms/Tag';
import CountDown from '../../components/molecules/CountDown';
import useRecipeData from '../../hooks/useRecipeData';

const Wrapper = styled(Flex)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px 10px;
  overflow: hidden;
`;

const ReceiptSection = styled(Flex)`
  flex: 0;
  margin: 0px 10px;
  writing-mode: horizontal-tb;
  width: 380px;
`;
const ReceiptContainer = styled(Flex)`
  display: inline-flex;
  writing-mode: vertical-lr;
  flex-wrap: wrap;
  align-content: flex-start;
  align-self: stretch;
`;
const ReceiptHeader = styled(Card)`
  border-bottom: none;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  z-index: 1;
  padding: 20px;
  padding-bottom: 12px;
  justify-content: stretch;
  flex-direction: row;
`;
const HaederContent = styled(Flex)`
  flex-direction: column;
  flex: 1;
`;
const HeaderContentRow = styled(Flex)`
  flex: 1;
  align-items: center;
`;
const BrandIcon = styled(Icon)`

`;
const ChannelNumber = styled(Text)`
  margin-left: 20px;
  font-weight: 600;
  font-size: 30px;
  line-height: 30px;
`;
const DateText = styled(Text)`
  font-size: 20px;
  margin-left: 5px;
  color: ${palette(
    'grayscale',
    2,
  )};
`;
const HeaderAction = styled(Flex)`
  margin-left: auto;
  align-self: flex-start;
  flex: 0;
`;

const MenuSection = styled(Flex)`
`;
const StyledRipped = styled(Ripped)`
  flex-direction: column;
  padding: 10px 20px;
`;
const OptionSection = styled(Flex)`
  flex-direction: column;
  margin-top: 5px;
`;
const MenuName = styled(Text)`
  font-weight: 600;
  color: ${palette(
    'grayscale',
    0,
  )};
  font-size: 22px;
  line-height: 26px;
`;
const OptionName = styled(Text)`
  font-weight: 400;
  color: ${palette(
    'grayscale',
    2,
  )};
  font-size: 20px;
  line-height: 30px;
`;

const ReceiptFooter = styled(Ripped)`
  border-top: none;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-radius: 0px 0px 15px 15px;
  padding: 20px;
  padding-top: 10px;
  z-index: 1;
`;
const CustomerRequest = styled(Card)`
  border: 2px solid ${palette(
    'grayscale',
    5,
  )};
`;
const CustomerRequestText = styled(Text)`
  font-weight: 400;
  color: ${palette(
    'grayscale',
    2,
  )};
  font-size: 20px;
  line-height: 26px;
`;
const TagSection = styled(Flex)`
  margin: 5px 0px;
  flex: 1;
  justify-content: flex-end;
`;
const StyledTag = styled(Tag)`
  padding: 4px 10px;
  align-self: flex-start;
  > p {
    font-size: 18px;
    line-height: 18px;
  }
`;

export const ORDER_TYPE_LABEL = {
  ORDER_DELIVERY: '배달',
  ORDER_HALL: '홀',
  ORDER_TAKEOUT: '포장',
};
export const orderButtonProps = {
  ORDER_IN: { // 주문 승인 대기
    label: '승인대기',
    disabled: true,
    palette: 'green',
  },
  ORDER_ACCEPTED: { // 주문 승인
    label: '주문접수',
    palette: 'green',
    themeType: 'light',
  },
  ORDER_WAITING: { // 조리 대기
    label: '조리준비',
    disabled: false,
    palette: 'yellow',
  },
  ORDER_COOKING: { // 조리중
    label: '조리',
    disabled: false,
    palette: 'orange',
    themeType: 'light',
  },
  ORDER_COOKED: { // 조리끝
    label: '완료',
    disabled: true,
  },
};

const getStatus = ({
  orderKitchen,
  activeStatusById,
  recipeData,
}) => {
  const cookerId = _.findIndex(
    activeStatusById,
    (list) => _.get(
      list,
      [
        0,
        'data',
        'orderKitchenId',
      ],
    ) === orderKitchen?.id,
  );
  const cookStatus = _.get(
    activeStatusById,
    [
      cookerId,
      0,
    ],
  );
  const recipe = _.find(
    recipeData,
    {
      id: _.get(
        orderKitchen,
        'recipeId',
      ),
    },
  );
  const recipeDurationS = _.get(
    recipe,
    [
      'detail',
      'duration',
    ],
    0,
  );
  const {
    name,
    timestamp,
  } = cookStatus || {};
  const cookStartTime = name === 'cook' ? timestamp : null;
  const completionTimeMs = cookStartTime + (recipeDurationS * 1000);
  const showTime = completionTimeMs > Date.now() && name === 'cook';

  let status = orderKitchen.status || 'ORDER_ACCEPTED';
  if (showTime) status = 'ORDER_COOKING';
  return {
    cookStartTime,
    completionTimeMs,
    showTime,
    cookerId,
    status,
  };
};
const EKStatusTag = (props) => {
  const {
    orderKitchen,
    activeStatusById,
    recipeData,
    ...others
  } = props;
  const {
    cookStartTime,
    completionTimeMs,
    showTime,
    cookerId,
    status,
  } = getStatus({
    orderKitchen,
    activeStatusById,
    recipeData,
  });
  const okStatusProps = orderButtonProps[status];
  return (
    <StyledTag
      icon={false}
      themeProps={{
        palette: okStatusProps?.palette,
        type: okStatusProps?.themeType || 'light',
      }}
      label={(
        <>
          {okStatusProps?.label}
          {showTime ? (
            <>
              {' - '}
              <CountDown
                palette="orange"
                shorten
                completionTimeMs={completionTimeMs}
              />
            </>
          ) : null}
          {cookerId > -1 ? (
            <>
              {' | '}
              {`EK P${cookerId + 1}`}
              {'  '}
            </>
          ) : null}
        </>
      )}
      style={{ paddingRight: showTime ? 20 : null }}
    />
  );
};
const ControlTowerMain = (props) => {
  const location = useLocation();
  const { data } = useOrderData({ sortOrder: 'desc' });
  const {
    activeStatusById,
    completedJobsById,
    machineStateById,
  } = useChefMonitor();
  const { data: recipeData } = useRecipeData();

  console.log(data);
  const orderList = data.slice(
    0,
    5,
  );
  console.log(orderList);
  const { ...others } = props;
  const lastFour = (str) => (str.length > 4 ? `...${str?.slice(-4)}` : str);

  return (
    <Wrapper>
      {orderList.map((order) => (
        <ReceiptContainer key={order.id}>
          <ReceiptSection>
            <ReceiptHeader palette="grayscale">
              <HaederContent>
                <HeaderContentRow>
                  <BrandIcon size={36} icon="loader" palette="red" />
                  <ChannelNumber>
                    {lastFour(order.channelNumber || order.outsideId)}-{order.id}
                  </ChannelNumber>
                </HeaderContentRow>
                <HeaderContentRow style={{ marginTop: 10 }}>
                  <Icon size="22" icon="clock" palette="grayscale" tone={3} style={{ margin: 5 }} />
                  <DateText>
                    {moment(order.date)
                      .format('HH:mm')}
                  </DateText>
                  <PlatformImage
                    platform={order.platform}
                    style={{ marginLeft: 15 }}
                  />
                  <DateText>
                    {ORDER_TYPE_LABEL[order.type]}
                  </DateText>
                </HeaderContentRow>
              </HaederContent>

              <HeaderAction>
                <Button label="완료" palette="black" />
              </HeaderAction>
            </ReceiptHeader>
          </ReceiptSection>
          {order.orderItem.filter((oi) => oi.parentId == null).map((orderItem, i) => {
            const option = order.orderItem.filter((oi) => oi.parentId === orderItem.id);

            return (
              <ReceiptSection key={orderItem.id}>
                <StyledRipped ripTop={i !== 0}>
                  <MenuName>{orderItem.name}</MenuName>
                  {orderItem.orderKitchen ? (
                    <TagSection>
                      <EKStatusTag
                        orderKitchen={orderItem.orderKitchen}
                        activeStatusById={activeStatusById}
                        recipeData={recipeData}
                      />
                    </TagSection>
                  ) : null}
                  <OptionSection>
                    {option.map((option) => (
                      <OptionName key={option.id}>{option.name}</OptionName>
                    ))}
                  </OptionSection>
                </StyledRipped>
              </ReceiptSection>
            );
          })}
          <ReceiptSection>
            <ReceiptFooter ripBottom={false}>
              <CustomerRequest>
                <CustomerRequestText>
                  {order.customerRequest}
                </CustomerRequestText>
              </CustomerRequest>
            </ReceiptFooter>
          </ReceiptSection>
        </ReceiptContainer>
      ))}
    </Wrapper>
  );
};

ControlTowerMain.propTypes = { };
ControlTowerMain.defaultProps = { };

export default ControlTowerMain;
