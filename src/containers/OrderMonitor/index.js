import PropTypes from 'prop-types';
import {
  useCallback,
  useState,
} from 'react';
import {
  Formik, useField, Form,
} from 'formik';

import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';
import moment from 'moment';
import _, {
  get,
} from 'lodash';
import {
  gql, useMutation,
} from '@apollo/client';

import { ifProp } from 'styled-tools';
import { findAllByDisplayValue } from '@testing-library/react';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import Link from '../../components/atoms/Link';

import PurchaseRow from '../../components/organisms/PurchaseRow';
import AntDTable from '../../components/organisms/AntDTable';
import Cell from '../../components/atoms/AntDTableCell';

import useInventoryData from '../../hooks/useInventoryData';
import useQueryParams from '../../hooks/useQueryParams';
import {
  formatCurrency,
  formatNumber,
} from '../../services/number';
import useProductData from '../../hooks/useProductData';
import useOrderData from '../../hooks/useOrderData';
import SearchBar from '../../components/organisms/SearchBar';
import useOrderAlert from '../../hooks/useOrderAlert';
import TooltipMask from '../../components/molecules/TooltipMask';
import PlatformImage from '../../components/atoms/PlatformImage';
import Tab from '../../components/molecules/Tab';

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
  min-width: 120px;
  padding: 10px;
`;
const StyledCell = styled(Cell)`
  text-decoration: ${ifProp(
    'isCancel',
    'line-through',
  )};
`;

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
    queryParams,
    setQueryParams,
  } = useQueryParams({ initialQueryParams: { page: 1 } });
  const [
    selectedTab,
    setSelectedTab,
  ] = useState('all');
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
  };
  const filteredItemisedOrderList = itemisedOrderList.filter((io) => {
    if (selectedTab === 'all') return true;
    const tabList = orderPlatformToTab[io.orderPlatform];
    if (tabList == null) { console.log(io.orderPlatform); }
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
      title: 'id',
      dataIndex: 'id',
      width: 100,
      render: (
        data,
        {
          orderId,
          isCancel,
          isSubMenu,
        },
      ) => {
        if (isSubMenu) return null;
        return <StyledCell isCancel={isCancel}>{data || orderId}</StyledCell>;
      },
    },
    {
      title: '채널번호',
      dataIndex: 'channelNo',
      width: 140,
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
          <StyledCell isCancel={isCancel} style={{ width: 140 }}>{data}</StyledCell>
        );
      },
    },
    {
      title: '주문번호',
      dataIndex: 'orderNo',
      width: 150,
      render: (data, row) => {
        const { isCancel } = row;
        if (row.isSubMenu) return null;
        return <StyledCell isCancel={isCancel}>{data || row.orderNo}</StyledCell>;
      },
    },
    // {
    //   title: '플랫폼',
    //   dataIndex: 'orderPlatform',
    //   width: 80,
    //   render: (data, row) => <StyledCell isCancel={isCancel}>{data}</StyledCell>,
    // },
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
      title: '주문시간',
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
          <StyledCell isCancel={isCancel} style={{ width: 50 }}>
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
          style={{ width: 250 }}
        >
          {`${data}`}
        </StyledCell>
      )
      ,
    },
    {
      title: '수량',
      dataIndex: 'qty',
      render: (data, row) => {
        const { isCancel } = row;
        return <StyledCell isCancel={isCancel} style={{ width: 30 }}>{data}</StyledCell>;
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
      title: '조리담당',
      dataIndex: 'cookStation',
      width: 140,
      render: (data, { isCancel }) => <StyledCell isCancel={isCancel}>{data}</StyledCell>,
    },
    {
      title: '조리상태',
      dataIndex: null,
      width: 140,
    },
    {
      title: '',
      dataIndex: 'action',
      width: 120,
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
                선택
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
