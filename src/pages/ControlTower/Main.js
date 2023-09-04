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
import EKStatusTag from '../../components/organisms/EKStatusTag';
import Tag from '../../components/atoms/Tag';
import CountDown from '../../components/molecules/CountDown';
import useRecipeData from '../../hooks/useRecipeData';
import PotUnit from '../../components/organisms/PotUnit';
import Receipt from '../../components/organisms/Receipt';

const Wrapper = styled(Flex)`
  flex-direction: column;
  align-items: stretch;
  padding: 20px 10px;
`;

const ReceiptWrapper = styled(Flex)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  overflow: auto;
  flex-basis: 1px;
`;
const PotWrapper = styled(Flex)`
  padding: 0px;
  flex: 0;
  flex-basis: 240px;
  max-height: 240px;
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

const PotCardContainer = styled(Flex)`
  display: flex;
  flex: 1;
  margin: 10px;
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

const ControlTowerMain = (props) => {
  const location = useLocation();
  const {
    data,
    completeOrder,
  } = useOrderData({
    sortOrder: 'desc',
    maxOrderStatus: 99,
  });
  const {
    activeStatusById,
    completedJobsById,
  } = useChefMonitor();
  const { data: recipeData } = useRecipeData();

  console.log(data);
  const orderList = data.slice(
    0,
    10,
  );
  console.log(orderList);
  const { ...others } = props;
  const lastFour = (str) => (str.length > 4 ? `...${str?.slice(-4)}` : str);

  return (
    <Wrapper>
      <ReceiptWrapper>
        {orderList.map((order) => (
          <Receipt
            key={order.id}
            order={order}
            activeStatusById={activeStatusById}
            completedJobsById={completedJobsById}
            recipeData={recipeData}
            completeOrder={completeOrder}
          />
        ))}
      </ReceiptWrapper>
      <PotWrapper>
        {_.times(5).map((i) => (
          <PotCardContainer
            key={i}
            href={`${window.origin}/gates/${i + 1}`}
          >
            <PotUnit
              cookerId={i}
            />
          </PotCardContainer>
        ))}
      </PotWrapper>
    </Wrapper>
  );
};

ControlTowerMain.propTypes = { };
ControlTowerMain.defaultProps = { };

export default ControlTowerMain;
