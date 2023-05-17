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

import Flex from '../components/atoms/Flex';
import Button from '../components/atoms/Button';
import Link from '../components/atoms/Link';

import PurchaseRow from '../components/organisms/PurchaseRow';
import AntDTable from '../components/organisms/AntDTable';
import Cell from '../components/atoms/AntDTableCell';

import useInventoryData from '../hooks/useInventoryData';
import useQueryParams from '../hooks/useQueryParams';
import {
  formatCurrency,
  formatNumber,
} from '../services/number';
import useProductData from '../hooks/useProductData';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
`;

const cellRenderers = [
  // {
  //   title: 'Id',
  //   dataIndex: 'id',
  //   // key: 'id',
  //   // render: (description) => description,
  //   width: 60,
  // },
  // {
  //   title: '등록날짜',
  //   dataIndex: 'created',
  //   width: 120,
  //   render: (data) => <Cell>{moment(Number(data)).format('L LT')}</Cell>,
  // },
  {
    title: '재료',
    dataIndex: 'name',
    width: 120,
  },
  // {
  //   title: '레시피',
  //   dataIndex: 'name',
  //   width: 120,
  // },
  // {
  //   title: '상품명',
  //   dataIndex: 'name',
  //   width: 120,
  // },
  {
    title: '재고',
    dataIndex: 'inventorySum',
    width: 120,
    render: (data, row) => {
      const unit = get(
        row,
        'unit',
      );
      const unitText = unit ? `(${get(
        row,
        'unit',
        '',
      )})` : '';
      return (
        <Cell>
          {`${formatNumber(data)}${unitText}`}
        </Cell>
      );
    },
  },
  {
    title: '최근 입고 날짜',
    dataIndex: 'inventory',
    width: 120,
    render: (data, row, i) => {
      const created = get(
        data,
        [
          0,
          'created',
        ],
      );
      console.log(data);
      console.log(created);
      console.log(moment(created).format());
      return (
        <Cell>
          {moment(created).format('LLL')}
        </Cell>
      );
    },
  },
  {
    title: '구매 가격',
    dataIndex: 'amount',
    render: (data, row) => {
      const unit = get(
        row,
        'product.unit',
        '',
      );
      const unitPrice = get(
        row,
        'unitPrice',
        0,
      );
      const unitQuantity = get(
        row,
        'unitQuantity',
        0,
      );
      return (
        <Cell>
          {`${formatCurrency(unitPrice * unitQuantity)}`}
        </Cell>
      );
    },
    width: 120,
  },
  // {
  //   title: '단위별 가격',
  //   dataIndex: 'unitPrice',
  //   width: 120,
  // },
];

const Storage = () => {
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams(
    {
      initialQueryParams: {
        page: 1,
        pageSize: 10,
      },
    },
  );

  const {
    // data,
    // count,
    productListData: data,
    productListCount: count,
    ingredientListData,
    ingredientListCount,
    loading,
    error,
  } = useProductData({
    limit: Number(queryParams.pageSize),
    offset: (queryParams.pageSize * (queryParams.page - 1)) || 0,
  });

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

  return (
    <Wrapper>
      <AntDTable
        modelName="model"
        cellRenderers={cellRenderers}
        data={data}
        itemsPerPage={pageSize}
        onPageChange={onPageChange}
        currentPage={currentPage}
        count={count}
        rowKey="id"
      />
    </Wrapper>
  );
};

export default Storage;
