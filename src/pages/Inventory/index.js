import {
  Formik, useField, Form,
} from 'formik';
import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';
import { cloneDeep } from 'lodash';
import {
  gql, useMutation,
} from '@apollo/client';

import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';

import useOrderData from '../../hooks/useOrderData';
import OrderItemInput from '../../components/molecules/OrderItemInput';
import PageAction from '../../components/molecules/PageAction';

const Wrapper = styled(Flex)`
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
      name
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

  return (
    <div>
      {orderData.map((orderItemData, i) => (
        <OrderItemInput
          key={`${orderItemData.order_id}${orderItemData.name}`}
          {...props}
          orderItem={orderItemData}
          onChange={(e) => {
            const newData = cloneDeep(value);
            newData[i].unit_quantity = Number(e.target.value);
            onChange(newData);
          }}
          max={orderItemData.unit_quantity}
          min={0}
          type="number"
          value={value[i].unit_quantity}
        />
      ))}
    </div>
  );
};

const Inventory = () => {
  const {
    data,
    loading,
    error,
  } = useOrderData({ id: null });

  const addInventoryListCompleted = () => {
    console.log('add inventory db');
  };

  const [addInventoryList] = useMutation(ADD_INVETORY_LIST, { onCompleted: addInventoryListCompleted });

  if (data == null) return null;

  return (
    <Wrapper>
      <Formik
        initialValues={{ data: cloneDeep(data) }}
        onSubmit={(values) => {
          const { data } = values;
          console.log(data);
          addInventoryList({ variables: { inventoryList: data.map((v) => ({ name: v.name })) } });
        }}
      >
        <StyledForm>
          <DummyDataField
            orderData={cloneDeep(data)}
            name="data"
          />
          <PageAction actions={[]}>
            <Button type="submit" label="저장" />
          </PageAction>
        </StyledForm>
      </Formik>
    </Wrapper>
  );
};

export default Inventory;
