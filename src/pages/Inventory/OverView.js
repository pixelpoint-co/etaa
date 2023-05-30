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

import useInventoryData from '../../hooks/useInventoryData';
import PurchaseRow from '../../components/organisms/PurchaseRow';
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

const today = moment().startOf('day');
const startDate = today.subtract(7, 'days');
const endDate = moment().endOf('day');

const PurchaseRowLink = (props) => {
  const { data } = props;
  return (
    <Link
      fill
      to={`/storage/edit/${data.id}`}
      // to={`/storage/edit/group?startDate=${todayStart}&endDate=${todayEnd}`}
    >
      <PurchaseRow {...props} />
    </Link>
  );
};
// id 				: Int
// productId		: Int
// name 			: String
// amount 			: Int
// unitPrice 		: Float
// parentId 		: Int
// created 		: String
// unitWeight 		: Int
// unitQuantity 	: Int
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
    data,
    loading,
    error,
  } = useInventoryData({});

  const addInventoryListCompleted = () => {
    console.log('add inventory db');
  };

  const [addInventoryList] = useMutation(
    ADD_INVETORY_LIST,
    { onCompleted: addInventoryListCompleted },
  );

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
      {/* dataSource={data}
        rowKey={rowKey}
        expandable={expandable}
        pagination={itemsPerPage > 0 ? {
          ...pagination,
          total: count,
          current: Number(currentPage),
          simple: isMobile,
          hideOnSinglePage: false,
        } : false}
        scroll={true || scroll}
        onChange={handleChange}
        isExpanded={isExpanded}
        loading={loading}
        tableLayout={tableLayout}
        rowSelection={rowSelection} */}
    </Wrapper>
  );
};

export default Storage;
