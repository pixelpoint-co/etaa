import PropTypes from 'prop-types';
import {
  useCallback,
  useState,
} from 'react';

import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';

import { ifProp } from 'styled-tools';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import CountDown from '../../components/molecules/CountDown';
import AntDTable from '../../components/organisms/AntDTable';
import Cell from '../../components/atoms/AntDTableCell';
import Text from '../../components/atoms/P';
import useQueryParams from '../../hooks/useQueryParams';
import useOrderData from '../../hooks/useOrderData';
import PlatformImage from '../../components/atoms/PlatformImage';
import Tab from '../../components/molecules/Tab';
import useChefMonitor from '../../hooks/useChefMonitor';
import Tag from '../../components/atoms/Tag';
import useRecipeData from '../../hooks/useRecipeData';
import Receipt from '../../components/organisms/Receipt';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
  flex-basis: 100%;
  flex-grow: 0;
  overflow: auto;
  max-width: 100%;
  overflow: hidden;
`;

const ReceiptWrapper = styled(Flex)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;

  margin: 0px -10px;
  margin-top: 20px;

  overflow: auto;
`;
const SearchContainer = styled(Flex)`
  margin-bottom: 20px;
  flex: 0;
`;
const TableContainer = styled(Flex)`
  margin-top: 20px;
  overflow-x: auto;
  flex-basis: 1px;
`;
const StyledButton = styled(Button)`
  padding: 10px;
  width: 48px;
  height: 48px;
`;

const StyledCell = styled(Cell)`
  text-decoration: ${ifProp(
    'isCancelled',
    'line-through',
  )};
`;
const ChannelCell = styled(StyledCell)`
  white-space: nowrap;
  text-align: left;
  width: 50px;
`;
const StyledTag = styled(Tag)`
  font-size: 18px;
  line-height: 18px;
  padding: 2px 6px;
`;
const nameToWaiterStatus = {
  prepCook: 'ORDER_WAITING',
  startCook: 'ORDER_COOKING',
  finishCook: 'ORDER_COOKED',
};
const orderButtonProps = {
  ORDER_IN: { // 주문 승인 대기
    label: '승인대기',
    disabled: true,
    palette: 'green',
  },
  ORDER_ACCEPTED: { // 주문 승인
    label: '주문접수',
    palette: 'green',
    disabled: false,
  },
  ORDER_WAITING: { // 조리 대기
    label: '조리준비',
    disabled: false,
    palette: 'yellow',
  },
  ORDER_COOKING: { // 조리중
    label: '조리',
    disabled: true,
    palette: 'red',
  },
  ORDER_COOKED: { // 조리끝
    label: '완료',
    disabled: true,
  },
};

const OrderMonitor = (props) => {
  const {
    filterCell,
    pageSize = 20,
    pickCellRenderers,
    selectRecipe,
    onClickOrder,
    selectedChannelNo,
    ...others
  } = props;
  const {
    activeStatusById,
    completedJobsById,
  } = useChefMonitor();
  const { data: recipeData } = useRecipeData();
  const { queryParams } = useQueryParams({ initialQueryParams: { page: 1 } });
  const [
    selectedTab,
    setSelectedTab,
  ] = useState('all');
  const { data: orderData } = useOrderData({
    sortOrder: 'asc',
    maxOrderStatus: 99,
    limit: pageSize,
    offset: (queryParams.pageSize * (queryParams.page - 1)) || 0,
  });
  const orderList = orderData.slice();
  const orderPlatformToTab = {
    배민: [
      'delivery',
      'baeMin',
      'baeMin1',
    ],
    쿠팡이츠: [
      'delivery',
      'coupangEats',
    ],
    요기요: [
      'delivery',
      'yogiyo',
      'yogiyoExpress',
    ],
    '요기요 익스프레스': [
      'delivery',
      'yogiyoExpress',
    ],
    요기배달: [
      'delivery',
      'yogiyoExpress',
      'yogiyo',
      'yogiBaedal',
    ],
    배민1: [
      'delivery',
      'baeMin',
      'baeMin1',
    ],
    타키: [
      'hall',
      'taky',
    ],
    POS: ['hall'],
  };

  const filteredOrderList = orderList.filter((order) => {
    if (selectedTab === 'all') return true;
    if (_.get(
      orderPlatformToTab,
      [order.platform],
      [],
    ).indexOf(selectedTab) >= 0) return true;
    return false;
  });
  return (
    <Wrapper>
      {/* <SearchContainer>
        <SearchBar
          label="검색"
          icon="search"
        // onSubmit={(searchKey) => {
        //   setKeyword(searchKey);
        // }}
        />
      </SearchContainer> */}
      <Tab
        themeProps={{ palette: 'primary' }}
        offThemeProps={{
          palette: 'grayscale',
          tone: 3,
          type: 'text',
        }}
        options={[
          {
            label: '전체',
            value: 'all',
          },
          {
            label: '배달',
            value: 'delivery',
          },
          {
            label: '홀',
            value: 'hall',
          },
          // {
          //   label: '포장',
          //   value: 'pickup',
          // },
          {
            label: '배민',
            value: 'baeMin',
          },
          {
            label: '요기요',
            value: 'yogiyo',
          },
          {
            label: '쿠팡',
            value: 'coupangEats',
          },
        ]}
        value={selectedTab}
        onSelect={setSelectedTab}
      />
      <ReceiptWrapper>
        {filteredOrderList.map((order) => (
          <Receipt
            key={order.id}
            order={order}
            hideComplete
            activeStatusById={activeStatusById}
            completedJobsById={completedJobsById}
            recipeData={recipeData}
            onClickOrderKitchenTag={(orderKitchen) => {
              selectRecipe(
                orderKitchen.recipeId,
                orderKitchen.id,
              );
            }}
          />
        ))}
      </ReceiptWrapper>
    </Wrapper>
  );
};

OrderMonitor.defaultProps = {
  pickCellRenderers: (v) => v,
  pageSize: 20,
};

OrderMonitor.propTypes = {
  pickCellRenderers: PropTypes.func,
  pageSize: PropTypes.number,
};
export default OrderMonitor;
