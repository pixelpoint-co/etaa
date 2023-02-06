import { useEffect } from 'react';
import {
  Formik, Field, Form,
} from 'formik';

import Flex from '../../components/atoms/Flex';
import Text from '../../components/atoms/P';
import Card from '../../components/atoms/Card';
import Label from '../../components/atoms/Label';
import Button from '../../components/atoms/Button';

import useOrderData from '../../hooks/useOrderData';

const Inventory = () => {
  const {
    data,
    loading,
    error,
  } = useOrderData({ id: null });

  return (
    <Flex>
      <Formik
        initialValues={{ checked: [] }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 1));
        }}
      >
        <Form>
          <Label>발주 물품 수령</Label>
          <Card>
            {/* {data.map((order) => (
              <Text
                key={`${order.created_at}${order.name}`}
                role="group"
                aria-labelledby="checkbox-group"
              >
                <Field
                  type="checkbox"
                  name="checked"
                  value={`${order.order_id}${order.name}`}
                />
                주문번호: {order.order_id} / 상품명: {order.name} / 수량: {order.amount}
              </Text>
            ))} */}
            <Button type="submit">Submit</Button>
          </Card>
        </Form>
      </Formik>
    </Flex>
  );
};

export default Inventory;
