import {
  Formik, useField, Form,
} from 'formik';

import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';

import moment from 'moment';
import _, {
  cloneDeep,
  lowerCase,
  get,
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
  @media (max-width: ${size('mobileBreakpoint')}) {
    overflow-x: auto;
    max-width: 100%;
  }
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
  const { purchaseList } = props;
  const { value } = meta;
  const onChange = helpers.setValue;
  console.log('purchaseList: ', purchaseList);
  console.log('value: ', value);
  return (
    <div>
      {(purchaseList || []).map((orderItemData, i) => (
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

const today = moment().add(9, 'hours').toISOString(); // TODO waiter db.Timestamp에 따라 수동으로 UTC기준으로 전환

const Inventory = () => {
  const {
    purchaseData: data,
    loading,
    error,
  } = usePurchaseData({
    id: null,
    created: today,
    type: 'single',
  });
  const {
    id,
    detail: purchaseItemList,
  } = data;
  const addInventoryListCompleted = () => {
    console.log('add inventory db');
  };

  const [addInventoryList] = useMutation(
    ADD_INVETORY_LIST,
    { onCompleted: addInventoryListCompleted },
  );
  console.log('loading: ', loading);
  console.log('data: ', data);
  if (data == null) return null;
  if (loading) return null;

  return (
    <Wrapper>
      <Formik
        initialValues={{
          purchaseItemList: cloneDeep(purchaseItemList),
          inventoryList: cloneDeep(purchaseItemList),
        }}
        onSubmit={(values) => {
          const { inventoryList } = values;
          const formattedInventoryList = inventoryList.map((v) => {
            const gramAmount = convertUnit(v.unit_amount, v.unit, v.unit_quantity);
            return {
              purchaseId: id,
              id: v.id,
              name: v.name,
              unitQuantity: gramAmount,
              // unitWeight: 'g',
              unitPrice: roundTo(
                unformat(v.unit_price) / gramAmount,
                4,
              ),
            };
          });
          console.log(inventoryList);
          console.log(formattedInventoryList);
          addInventoryList({ variables: { inventoryList: formattedInventoryList } });
        }}
      >
        <StyledForm>
          <DummyDataField
            purchaseList={cloneDeep(purchaseItemList)}
            name="inventoryList"
          />
          <PageAction actions={[]}>
            <Button type="submit" label="저장" loaderStroke="white" loaderSize={32} />
          </PageAction>
          <div style={{ padding: `${50 + 15 + 15}px 0px` }} />
        </StyledForm>
      </Formik>
    </Wrapper>
  );
};

export default Inventory;
