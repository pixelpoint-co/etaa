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

const DummyDataField = (props) => {
  const [
    field,
    meta,
    helpers,
  ] = useField(props);
  const { orderData } = props;
  const { value } = meta;
  const onChange = helpers.setValue;
  console.log('orderData: ', orderData);
  console.log('value: ', value);
  return (
    <div>
      {(orderData || []).map((orderItemData, i) => (
        <OrderItemInput
          key={`${orderItemData.order_id}${orderItemData.name}`}
          {...props}
          orderItem={orderItemData}
          onChange={(e) => {
            const newData = cloneDeep(value);
            newData[i].unit_quantity = Number(e.target.value);
            onChange(newData);
          }}
          setValue={(quantity) => {
            console.log('value: ', value);

            const newData = cloneDeep(value);
            newData[i].unit_quantity = quantity;
            onChange(newData);
          }}
          max={orderItemData.unit_quantity}
          min={0}
          type="number"
          value={_.get(value, [
            i,
            'unit_quantity',
          ])}
        />
      ))}
    </div>
  );
};

const today = moment().startOf('day');
const startDate = today.subtract(7, 'days');
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
    purchaseListData: data,
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

  if (data == null) return null;
  if (loading) return null;

  return (
    <Wrapper>
      <Button
        link="/inventory/"
        label="sdf"
      />
      <StyledList
        data={data}
        RowComponent={PurchaseRowLink}
      />
    </Wrapper>
  );
};

export default Inventory;
