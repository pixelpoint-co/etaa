import PropTypes from 'prop-types';
import {
  useCallback,
} from 'react';
import {
  Formik, useField, Form,
} from 'formik';

import {
  palette, size,
} from 'styled-theme';
import hexToRgba from 'hex-to-rgba';
import styled from 'styled-components';
import moment from 'moment';
import _, {
  get,
} from 'lodash';
import {
  gql, useMutation,
} from '@apollo/client';
import theme from '../../theme';

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

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
`;
const CookedPrepare = styled(Card)`
  
    color: ${palette(
    'orange',
    0,
  )};
    padding: 2px 6px;
  `;

const Cooking = styled(Card)`
   
    color: ${palette(
    'orange',
    0,
  )};
    padding: 2px 6px;
  `;

const TableContainer = styled(Flex)`
`;

const OrderMonitor = (props) => {
  const {
    filterCell,
    pageSize = 5,
    pickCellRenderers,
    selectRecipe,
    ...others
  } = props;
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams({ initialQueryParams: { page: 1 } });
  const { onAlert } = useOrderAlert();

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
  const count = data.length;
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

  const filteringItemisedOrderList = itemisedOrderList
    .filter((io) => (io.isSubMenu === false) && io.item !== '배달비');
  // .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  // .reverse();
  console.log(filteringItemisedOrderList);
  const cellRenderers = [

    {
      title: '주문번호',
      dataIndex: 'orderNoUnique',
      // width: 100,
      render: (data, row) => {
        // if (row.isSubMenu) return null;
        return <Cell>{data || row.orderNo}</Cell>;
      },
    },
    {
      title: '주문시간',
      dataIndex: 'dateTime',
      // width: 140,
      render: (data, row) => {
        return (
          <Cell style={{ width: 100 }}>
            {moment(data)
              .add(
                9,
                'hours',
              )
              .format('LT')}
          </Cell>
        );
      },
    },
    // {
    //   title: '플랫폼',
    //   dataIndex: 'orderPlatform',
    //   width: 140,
    //   render: (data) => {
    //     return <Cell>{data}</Cell>;
    //   },
    // },
    {
      title: '메뉴',
      dataIndex: 'item',
      // width: 140,
      render: (data, row) => {
        if (row.isSubMenu) return null;
        return <Cell>{data}</Cell>;
      },
    },
    // {
    //   title: '수량',
    //   dataIndex: 'qty',
    //   width: 100,
    //   flexBasis: 100,
    //   render: (data, row) => {
    //     if (row.isSubMenu) return null;
    //     return <Cell>{data}</Cell>;
    //   },
    // },
    // {
    //   title: '추가옵션',
    //   dataIndex: 'item',
    //   width: 140,
    //   render: (data, row) => {
    //     if (!row.isSubMenu) return null;
    //     return <Cell style={{ width: 180 }}>{data}</Cell>;
    //   },
    // },
    // {
    //   title: '고객요청',
    //   dataIndex: 'requestCustomer',
    //   width: 140,
    //   render: (data, row) => {
    //     if (row.isSubMenu) return null;
    //     return <Cell style={{ width: 130 }}>{data}</Cell>;
    //   },
    // },
    {
      title: '조리담당',
      dataIndex: 'cookStation',
      // width: 140,
      render: (data) => {
        return <Cell>{data}</Cell>;
      },
    },
    {
      title: '조리상태',
      dataIndex: 'orderKitchen',
      // width: 140,
      render: (data, row) => {
        console.log(data);

        if (!data) return null;
        if (data.status === 'ORDER_ACCEPTED') { return <Cell>조리준비</Cell>; }
        if (data.status === 'ORDER_WAITING') { return <Cell>주문접수</Cell>; }
        if (data.status === 'ORDER_COOKING') { return <Cell>조리중</Cell>; }
        if (data.status === 'ORDER_COOKED') { return <Cell>완료</Cell>; }
      },
    },
    {
      title: '상세내역',
      dataIndex: 'action',
      // width: 120,
      render: (data, row) => {
        // if (!row.orderKitchen) return null;

        return (
          <Cell>
            <Button
              onClick={() => {
                selectRecipe(
                  row.orderKitchen.recipeId,
                  row.orderKitchen.id,
                );
              }}
            >
              레시피 선택
            </Button>
          </Cell>
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
      <TableContainer>
        <AntDTable
          modelName="model"
          cellRenderers={pickCellRenderers(cellRenderers)}
          // data={itemisedOrderList}
          data={filteringItemisedOrderList}
          itemsPerPage={pageSize}
          onPageChange={onPageChange}
          currentPage={currentPage}
          count={count}
          rowKey="id"
          bordered={false}
          size="small"
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
