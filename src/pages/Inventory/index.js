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

const Wrapper = styled(Flex)`
  flex: 1;
`;
const StyledForm = styled(Form)`
  display: flex; 
  flex-direction: column;
  flex: 1;
`;

const ADD_INVETORY = gql`
  mutation AddInventory($inventory: InventoryInput) {
    addInventory(inventory: $inventory) {
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

  const addInventoryCompleted = () => {
    console.log(':x');
  };

  const [
    addInventory,
    {
      data: inven_data,
      loading: inven_loading,
      error: inven_error,
    },
  ] = useMutation(ADD_INVETORY, { onCompleted: addInventoryCompleted });
  console.log(inven_data);
  if (data == null) return null;

  return (
    <Wrapper>
      <Formik
        initialValues={{ data: cloneDeep(data) }}
        onSubmit={async (values) => {
          try {
            alert(JSON.stringify(values, null, 1));
            const result = await addInventory({ variables: { inventory: { name: values.data[0].name } } });
            console.log(result);
          } catch (e) {
            console.log(e);
            throw e;
          }
        }}
      >
        <StyledForm>
          <DummyDataField
            orderData={cloneDeep(data)}
            name="data"
          />
          <Button type="submit">Submit</Button>
        </StyledForm>
      </Formik>
    </Wrapper>
  );
};

export default Inventory;
