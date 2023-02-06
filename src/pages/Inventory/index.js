import { useEffect } from 'react';
import {
  Formik, Field, Form,
} from 'formik';
import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';

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
const Inventory = () => {
  const {
    data,
    loading,
    error,
  } = useOrderData({ id: null });
  if (data == null) return null;
  return (
    <Wrapper>
      <Formik
        initialValues={{ checked: [] }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 1));
        }}
      >
        <StyledForm>
          {data.map((orderItemData) => (
            <OrderItemInput
              key={`${orderItemData.order_id}${orderItemData.name}`}
              orderItem={orderItemData}
            />
          ))}
          <Button type="submit">Submit</Button>
        </StyledForm>
      </Formik>
    </Wrapper>
  );
};

export default Inventory;
