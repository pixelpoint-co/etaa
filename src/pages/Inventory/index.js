import { Formik, Field, Form } from 'formik';

import Flex from '../../components/atoms/Flex';
import Text from '../../components/atoms/P';
import Card from '../../components/atoms/Card';
import Label from '../../components/atoms/Label';
import Button from '../../components/atoms/Button';

const Inventory = () => {
  const data = [
    {
      name: '깐양파(180g내외/ea)',
      order_id: '429993',
      unit_price: 2400,
      unit_weight: 1000,
      amount: 5,
      created_at: 20230201,
      toggle: false,
    },
    {
      name: '토마토홀',
      order_id: '429993',
      unit_price: 7600,
      unit_weight: 2500,
      amount: 18,
      created_at: 20230201,
      toggle: false,
    },
    {
      name: '감자튀김(반달,웨지스킨온)',
      order_id: '428853',
      unit_price: 9100,
      unit_weight: 2000,
      amount: 2,
      created_at: 20230131,
      toggle: false,
    },
  ]
  return (
    <Flex>
      <Formik
        initialValues={{
          checked: [],
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 1));
        }}
      >
        <Form>
          <Label>발주 물품 수령</Label>
          <Card>
            {data.map((order) => (
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
            ))}
            <Button type="submit">Submit</Button>
          </Card>
        </Form>
      </Formik>
    </Flex>
  );
};

export default Inventory;