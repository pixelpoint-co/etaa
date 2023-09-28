import styled from 'styled-components';
import moment from 'moment';
import _, { get } from 'lodash';

import Flex from '../../components/atoms/Flex';

import useInventoryData from '../../hooks/useInventoryData';
import AntDTable from '../../components/organisms/AntDTable';
import Cell from '../../components/atoms/AntDTableCell';

import {
  formatCurrency,
  formatNumber,
} from '../../services/number';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
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
    title: '자재명',
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
      const unit = get(
        row,
        'product.unit',
      );
      const unitText = unit ? `(${get(
        row,
        'product.unit',
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
    title: '구매 수량',
    dataIndex: 'amount',
    width: 120,
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
    data,
    loading,
    error,
  } = useInventoryData({});

  if (data == null) return null;
  if (loading) return null;

  return (
    <Wrapper>
      <AntDTable
        modelName="model"
        cellRenderers={cellRenderers}
        data={data}
        itemsPerPage={10}
        currentPage={1}
        count={data.length}
        rowKey="id"
      />
    </Wrapper>
  );
};

export default Storage;
