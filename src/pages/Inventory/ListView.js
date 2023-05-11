import { useCallback } from 'react';
import {
  Formik, useField, Form,
} from 'formik';

import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';
import moment from 'moment';
import _, { get } from 'lodash';
import {
  gql, useMutation,
} from '@apollo/client';

import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
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

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
`;
const StyledList = styled(AntDTable)`
  flex: 1;
`;
const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ADD_INVETORY_LIST = gql`
  mutation AddInventoryList($inventoryList: [InventoryInput]) {
    addInventoryList(inventoryList: $inventoryList) {
      id,
      name,
    }
  }
`;

const cellRenderers = [
  {
    title: 'Id',
    dataIndex: 'id',
    // key: 'id',
    // render: (description) => description,
    width: 60,
  },
  {
    title: '등록날짜',
    dataIndex: 'created',
    width: 120,
    render: (data) => <Cell>{moment(Number(data)).format('L LT')}</Cell>,
  },
  {
    title: '재료',
    dataIndex: [
      'product',
      'name',
    ],
    width: 120,
  },
  {
    title: '상품명',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '용량',
    dataIndex: 'unitQuantity',
    width: 120,
    render: (data, row) => {
      const unit = get(row, 'product.unit');
      const unitText = unit ? `(${get(row, 'product.unit', '')})` : '';
      return (
        <Cell>
          {`${formatNumber(data)}${unitText}`}
        </Cell>
      );
    },
  },
  {
    title: '구매 수량',
    dataIndex: 'amount',
    width: 120,
  },
  {
    title: '구매 가격',
    dataIndex: 'amount',
    render: (data, row) => {
      const unit = get(row, 'product.unit', '');
      const unitPrice = get(row, 'unitPrice', 0);
      const unitQuantity = get(row, 'unitQuantity', 0);
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
    data,
    count,
    loading,
    error,
  } = useInventoryData({
    limit: Number(queryParams.pageSize),
    offset: (queryParams.pageSize * (queryParams.page - 1)) || 0,
  });

  const {
    pageSize,
    page: currentPage,
  } = queryParams;

  const onPageChange = useCallback(async ({ currentPage: newPage }) => {
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, [setQueryParams]);

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
