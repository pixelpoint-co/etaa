import {
  useCallback,
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
const TableContainer = styled(Flex)`
  margin-top: 20px;
`;
const cellRenderers = [
  {
    title: '주문번호',
    dataIndex: 'orderNoUnique',
    width: 100,
    render: (data, row) => {
      if (row.isSubMenu) return null;
      return <Cell>{data || row.orderNo}</Cell>;
    },
  },
  {
    title: '주문시간',
    dataIndex: 'dateTimeISO',
    width: 140,
    render: (data, row) => {
      return (
        <Cell>
          {moment(data).format('lll')}
        </Cell>
      );
    },
  },
  {
    title: '플랫폼',
    dataIndex: 'orderPlatform',
    width: 140,
    render: (data) => {
      return <Cell>{data}</Cell>;
    },
  },
  {
    title: '메뉴',
    dataIndex: 'item',
    width: 140,
    render: (data, row) => {
      if (row.isSubMenu) return null;
      return <Cell>{data}</Cell>;
    },
  },
  {
    title: '수량',
    dataIndex: 'qty',
    width: 100,
    flexBasis: 100,
    render: (data, row) => {
      if (row.isSubMenu) return null;
      return <Cell>{data}</Cell>;
    },
  },
  {
    title: '추가옵션',
    dataIndex: 'item',
    width: 140,
    render: (data, row) => {
      if (!row.isSubMenu) return null;
      return <Cell>{data}</Cell>;
    },
  },
  {
    title: '조리담당',
    dataIndex: 'cookStation',
    width: 140,
    render: (data) => {
      return <Cell>{data}</Cell>;
    },
  },
  {
    title: '조리상태',
    dataIndex: null,
    width: 140,
  },
  // {
  //   title: '구매 가격',
  //   dataIndex: 'amount',
  //   render: (data, row) => {
  //     const unit = get(
  //       row,
  //       'product.unit',
  //       '',
  //     );
  //     const unitPrice = get(
  //       row,
  //       'unitPrice',
  //       0,
  //     );
  //     const unitQuantity = get(
  //       row,
  //       'unitQuantity',
  //       0,
  //     );
  //     return (
  //       <Cell>
  //         {`${formatCurrency(unitPrice * unitQuantity)}`}
  //       </Cell>
  //     );
  //   },
  //   width: 120,
  // },
  // {
  //   title: '단위별 가격',
  //   dataIndex: 'unitPrice',
  //   width: 120,
  // },
];

const OrderMonitor = () => {
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams(
    {
      initialQueryParams: {
        page: 1,
        pageSize: 20,
      },
    },
  );
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
    limit: Number(queryParams.pageSize),
    offset: (queryParams.pageSize * (queryParams.page - 1)) || 0,
  });
  const count = data.length;
  const {
    pageSize,
    page: currentPage,
  } = queryParams;

  const onPageChange = useCallback(
    async ({ currentPage: newPage }) => {
      setQueryParams((prev) => ({
        ...prev,
        page: newPage,
      }));
    },
    [setQueryParams],
  );
  console.log(
    'itemisedOrderList: ',
    itemisedOrderList,
  );
  return (
    <Wrapper>
      <SearchBar
        style={{ flex: 0 }}
        label="검색"
        icon="search"
        // onSubmit={(searchKey) => {
        //   setKeyword(searchKey);
        // }}
      />
      <TableContainer>
        <AntDTable
          modelName="model"
          cellRenderers={cellRenderers}
          data={itemisedOrderList}
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

export default OrderMonitor;
