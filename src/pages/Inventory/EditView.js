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

import usePurchaseData from '../../hooks/usePurchaseData';
import OrderItemInput from '../../components/molecules/OrderItemInput';
import PageAction from '../../components/organisms/PageAction';

import {
  unformat, roundTo,
} from '../../services/number';

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

const convertUnit = (amount, unit, quantity) => {
  // eslint-disable-next-line no-nested-ternary
  const lowerCaseUnit = lowerCase(unit);
  let multiplier = 1;
  switch (lowerCaseUnit) {
    case 'kg':
      multiplier = 1000;
      break;
    case 'g':
      multiplier = 1;
      break;

    case 'l':
      multiplier = 1;
      break;
    default:
      multiplier = 1;
      break;
  }
  return unformat(amount) * multiplier * unformat(quantity);
};

const today = moment().toISOString();

const Inventory = () => {
  const {
    pId,
    data,
    loading,
    error,
  } = usePurchaseData({
    id: null,
    created: today,
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
  console.log('data: ', data);
  console.log('pId: ', pId);

  return (
    <Wrapper>
      <Formik
        initialValues={{ data: cloneDeep(data) }}
        onSubmit={(values) => {
          const { data } = values;
          const inventoryList = data.map((v) => {
            const gramAmount = convertUnit(v.unit_amount, v.unit, v.unit_quantity);
            return {
              purchaseId: pId,
              id: v.id,
              name: v.name,
              orderHeroOrderId: v.order_id,
              unitQuantity: gramAmount,
              // unitWeight: 'g',
              unitPrice: roundTo(
                unformat(v.unit_price) / gramAmount,
                4,
              ),
            };
          });
          console.log(inventoryList);
          addInventoryList({ variables: { inventoryList } });
        }}
      >
        <StyledForm>
          <DummyDataField
            orderData={cloneDeep(data)}
            name="data"
          />
          <PageAction actions={[]}>
            <Button type="submit" label="저장" loaderStroke="white" loaderSize={32} />
          </PageAction>
        </StyledForm>
      </Formik>
    </Wrapper>
  );
};

export default Inventory;
