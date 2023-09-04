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
  const {
    data,
    completeOrder,
  } = useOrderData({
    sortOrder: 'asc',
    maxOrderStatus: 99,
  });
  const {
    activeStatusById,
    completedJobsById,
  } = useChefMonitor();
  const { data: recipeData } = useRecipeData();

  const orderList = data.slice();

  const { ...others } = props;

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
