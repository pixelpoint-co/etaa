import {
  Formik, useField, Form,
} from 'formik';

import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';
import moment from 'moment';
import _, {
  cloneDeep, lowerCase,
} from 'lodash';
import {
  gql, useMutation,
} from '@apollo/client';

import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import Link from '../../components/atoms/Link';

import usePurchaseData from '../../hooks/usePurchaseData';
import OrderItemInput from '../../components/molecules/OrderItemInput';
import PurchaseRow from '../../components/organisms/PurchaseRow';
import AntDList from '../../components/organisms/AntDList';

import { unformat } from '../../services/number';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
`;
const StyledList = styled(AntDList)`
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
const startDate = today.subtract(
  7, 'days',
);
const endDate = moment().endOf('day');

const PurchaseRowLink = (props) => {
  const { data } = props;
  console.log(data);
  // const todayStart = moment(Number(data.created)).startOf('day').toISOString();
  // const todayEnd = moment(Number(data.created)).endOf('day').toISOString();
  return (
    <Link
      fill
      to={`/inventory/edit/${data.id}`}
      // to={`/inventory/edit/group?startDate=${todayStart}&endDate=${todayEnd}`}
    >
      <PurchaseRow {...props} />
    </Link>
  );
};

const Inventory = () => {
  const {
    pId,
    purchaseListData,
    loading,
    error,
  } = usePurchaseData({
    id: null,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const addInventoryListCompleted = () => {
    console.log('add inventory db');
  };

  const [addInventoryList] = useMutation(
    ADD_INVETORY_LIST,
    { onCompleted: addInventoryListCompleted },
  );

  if (purchaseListData == null) return null;
  if (loading) return null;
  const listSource = purchaseListData.map((d) => ({ data: d }));
  return (
    <Wrapper>
      <Button
        to="/purchase/create"
        label="생성"
      />
      <StyledList
        dataSource={listSource}
        RowComponent={PurchaseRowLink}
      />
    </Wrapper>
  );
};

export default Inventory;
