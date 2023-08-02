import PropTypes from 'prop-types';
import {
  useCallback,
  useState,
} from 'react';

import styled from 'styled-components';
import moment from 'moment';
import _, {
  get,
} from 'lodash';

import { ifProp } from 'styled-tools';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import CountDown from '../../components/molecules/CountDown';
import AntDTable from '../../components/organisms/AntDTable';
import Cell from '../../components/atoms/AntDTableCell';
import Text from '../../components/atoms/P';
import useQueryParams from '../../hooks/useQueryParams';
import useOrderData from '../../hooks/useOrderData';
import SearchBar from '../../components/organisms/SearchBar';
import TooltipMask from '../../components/molecules/TooltipMask';
import PlatformImage from '../../components/atoms/PlatformImage';
import Tab from '../../components/molecules/Tab';
import useChefMonitor from '../../hooks/useChefMonitor';
import Tag from '../../components/atoms/Tag';
import usePotController from '../../hooks/usePotController';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
  flex-basis: 100%;
  flex-grow: 0;
  overflow: auto;
`;
const SearchContainer = styled(Flex)`
  margin-bottom: 20px;
  flex: 0;
`;
const TableContainer = styled(Flex)`
  margin-top: 20px;
`;
const StyledButton = styled(Button)`
  padding: 10px;
  width: 48px;
  height: 48px;
`;

const StyledCell = styled(Cell)`
  text-decoration: ${ifProp(
    'isCancel',
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
    eKQueue,
    chefMonitorPotList,
  } = useChefMonitor();
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams({ initialQueryParams: { page: 1 } });
  const [
    selectedTab,
    setSelectedTab,
  ] = useState('all');
  const potController = usePotController(0);
  const { orderKitchenRefetchTime } = potController;

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
    orderKitchenRefetchTime,
    chefMonitorPotList,
    chefMonitoringData: eKQueue?.completedJobList,
    limit: pageSize,
    offset: (queryParams.pageSize * (queryParams.page - 1)) || 0,
  });

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
    배민1: [
      'delivery',
      'baeMin1',
    ],
    타키: [
      'hall',
      'taky',
    ],
    POS: ['hall'],
  };
  const filteredItemisedOrderList = itemisedOrderList.filter((io) => {
    if (selectedTab === 'all') return true;
    if (orderPlatformToTab[io.orderPlatform].indexOf(selectedTab) >= 0) return true;
    return false;
  });
  const count = filteredItemisedOrderList.length;
  const { page: currentPage } = queryParams;
  const onPageChange = useCallback(
    async ({ currentPage: newPage }) => {
      setQueryParams((prev) => ({
        ...prev,
        page: newPage,
      }));
    },
    [setQueryParams],
  );

  const cellRenderers = [
    {
      title: '채널',
      dataIndex: 'channelNo',
      render: (
        data,
        {
          isCancel,
          lineIndex,
          ...rest
        },
        rowIndex,
      ) => {
        if (rowIndex !== 0 && lineIndex !== 0) return null;
        const lastFour = `...${data.slice(-4)}`;
        return (
          <ChannelCell
            isCancel={isCancel}
          >
            {lastFour}
          </ChannelCell>
        );
      },
    },
    {
      title: 'orderId',
      dataIndex: 'orderId',
      width: 60,
      render: (data, row) => {
        const { isCancel } = row;
        return <StyledCell isCancel={isCancel}>{data}</StyledCell>;
      },
    },
    {
      title: 'id',
      dataIndex: 'id',
      width: 60,
      render: (data, row) => {
        const { isCancel } = row;
        return <StyledCell isCancel={isCancel}>{data}</StyledCell>;
      },
    },
    {
      title: 'okId',
      dataIndex: 'okId',
      width: 60,
      render: (data, row) => {
        const { isCancel } = row;
        return <StyledCell isCancel={isCancel}>{data}</StyledCell>;
      },
    },
    {
      title: '플랫폼',
      dataIndex: 'orderPlatform',
      render: (
        data,
        {
          isCancel,
          lineIndex,
        },
        rowIndex,
      ) => {
        if (rowIndex !== 0 && lineIndex !== 0) return null;
        return (
          <StyledCell isCancel={isCancel} style={{ width: 40 }}>
            <Flex
              style={{
                position: 'absolute',
                right: 0,
                left: 0,
                bottom: 0,
                top: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PlatformImage
                platform={data}
                style={{
                  marginTop: -18,
                  marginBottom: -18,
                }}
              />
            </Flex>
          </StyledCell>
        );
      },
    },
    {
      title: '주문',
      dataIndex: 'dateTimeISO',
      render: (
        data,
        {
          isCancel,
          lineIndex,
        },
        rowIndex,
      ) => {
        if (rowIndex !== 0 && lineIndex !== 0) return null;
        return (
          <StyledCell isCancel={isCancel} style={{ width: 38 }}>
            {moment(data)
              .format('HH:mm')}
          </StyledCell>
        );
      },
    },
    {
      title: '메뉴',
      dataIndex: 'item',
      render: (data, {
        isCancel,
        qty,
      }) => (
        <StyledCell
          isCancel={isCancel}
          style={{ width: 230 }}
        >
          {`${data}`}
        </StyledCell>
      )
      ,
    },
    {
      title: '수',
      dataIndex: 'qty',
      render: (data, row) => {
        const { isCancel } = row;
        return <StyledCell isCancel={isCancel} style={{ width: 16 }}>{data}</StyledCell>;
      },
    },
    {
      title: '고객요청',
      dataIndex: 'requestCustomer',
      render: (data, row) => {
        const { isCancel } = row;
        if (row.isSubMenu) return null;
        return <StyledCell isCancel={isCancel}>{data}</StyledCell>;
      },
    },
    {
      title: '조리상태',
      dataIndex: 'orderKitchen',
      render: (data, row) => {
        const { isCancel } = row;
        const pot = get(
          row,
          'pot',
          {},
        );
        const recipeDurationS = _.get(
          row,
          [
            'recipe',
            'detail',
            'duration',
          ],
          0,
        );
        const {
          name,
          finishedOn,
        } = pot;
        const cookStartTime = name === 'startCook' ? finishedOn : null;
        const completionTimeMs = cookStartTime + (recipeDurationS * 1000);
        const showTime = completionTimeMs > Date.now() && data?.status === 'ORDER_COOKING';
        return (
          <StyledCell isCancel={isCancel} style={{ width: 100 }}>
            {data ? (
              <StyledTag
                icon={false}
                themeProps={{
                  palette: orderButtonProps[data.status]?.palette,
                  themeType: 'light',
                }}
                label={(
                  <Text
                    color="white"
                  >
                    {orderButtonProps[data.status]?.label}
                    {showTime ? (
                      <>
                        {' - '}
                        <CountDown
                          color="white"
                          shorten
                          completionTimeMs={completionTimeMs}
                        />
                      </>
                    ) : null}
                  </Text>
                )}
              />

            ) : null}

          </StyledCell>
        );
      },
    },
    {
      title: '조리담당',
      dataIndex: 'cookStation',
      render: (data, row) => {
        const { isCancel } = row;
        const cookerId = _.get(
          row,
          [
            'pot',
            'cookerId',
          ],
          null,
        );

        const potLabel = _.isNull(cookerId) ? null : ` P${cookerId + 1}`;
        return (
          <StyledCell isCancel={isCancel} style={{ width: 50 }}>
            {data}
            {potLabel}
          </StyledCell>
        );
      },
    },
    {
      title: '',
      dataIndex: 'action',
      width: 80,
      render: (
        data,
        row,
        rowIndex,
      ) => {
        const {
          isCancel,
          lineIndex,
        } = row;
        const hasOrderKitchen = row.orderKitchen;
        const isSelected = row.channelNo === selectedChannelNo;
        const firstLineOrFirstRow = rowIndex !== 0 && lineIndex !== 0;
        return (
          <StyledCell
            isCancel={isCancel}
            style={{
              marginTop: -12,
              marginBottom: -12,
            }}
          >
            {!firstLineOrFirstRow ? (
              <StyledButton
                themeType="outline"
                palette="grayscale"
                tone={isSelected ? 4 : 0}
                disabled={isCancel}
                disable
                onClick={() => {
                  onClickOrder(row);
                }}
              >
                +
              </StyledButton>
            ) : null}
          </StyledCell>
        );
      },
    },
  ];
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
          // {
          //   label: '배민',
          //   value: 'baeMin',
          // },
          // {
          //   label: '요기요',
          //   value: 'yogiyo',
          // },
          // {
          //   label: '쿠팡',
          //   value: 'coupangEats',
          // },
        ]}
        value={selectedTab}
        onSelect={setSelectedTab}
      />
      <TableContainer>
        <AntDTable
          modelName="model"
          cellRenderers={pickCellRenderers(cellRenderers)}
          data={
            filteredItemisedOrderList
            // _.uniqBy(
            //     .filter((io) => !io.isSubMenu && !!io.orderKitchen),
            //   'orderNo',
            // )
          }
          itemsPerPage={pageSize}
          onPageChange={onPageChange}
          currentPage={currentPage}
          count={count}
          rowKey="id"
        />
      </TableContainer>
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
