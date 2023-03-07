import {
  Formik, useField, Form,
} from 'formik';

import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';

import moment from 'moment';
import _, {
  cloneDeep,
  lowerCase,
  reduce,
  get,
} from 'lodash';
import {
  gql, useMutation,
} from '@apollo/client';

import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import LabelValue from '../../components/molecules/LabelValue';
import usePurchaseData from '../../hooks/usePurchaseData';
import OrderItemInput from '../../components/molecules/OrderItemInput';
import PageAction from '../../components/organisms/PageAction';

import {
  unformat, roundTo, convertUnit,
} from '../../services/number';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
  @media (max-width: ${size('mobileBreakpoint')}) {
    overflow-x: auto;
  }
`;
const StyledForm = styled(Form)`
  display: flex;
  flex: 1;
  max-width: 100%;
  flex-direction: column;
`;

const ADD_INVETORY_LIST = gql`
  mutation AddInventoryList($inventoryList: [InventoryInput]) {
    addInventoryList(inventoryList: $inventoryList) {
      id,
      name,
    }
  }
`;
const DDContainer = styled(Flex)`
  flex-direction: column;
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
  return (
    <DDContainer>
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
    </DDContainer>
  );
};

const today = moment().toISOString(); // TODO waiter db.Timestamp에 따라 수동으로 UTC기준으로 전환

const Inventory = () => {
  const { id } = useParams();
  const {
    purchaseData: data,
    purchaseListData: listData,
    loading,
    error,
  } = usePurchaseData({
    id,
    created: today,
    startDate: moment(today).subtract(1, 'day'),
    endDate: today,
    type: 'many',
  });
  // const {
  //   id,
  //   detail: purchaseItemList,
  //   inventory: inventoryList,
  // } = data;
  const addInventoryListCompleted = () => {
    console.log('add inventory db');
    alert('기록되었습니다');
    window.location.reload();
  };

  const [
    addInventoryList,
    {
      loading: addInventoryListLoading,
      error: addInventoryListError,
    },
  ] = useMutation(
    ADD_INVETORY_LIST,
    { onCompleted: addInventoryListCompleted },
  );
  if (data == null) return null;
  if (loading) return null;
  const parsedPurchaseItemList = reduce(
    listData,
    (ac, cu) => {
      return [
        ...ac,
        ...cu.detail.map((purchaseItem) => ({
          ...purchaseItem,
          // unit_quantity: 0,
          purchase_id: cu.id,
          account: cu.account,
          created: cu.created,
        })),
      ];
    },
    [],
  );
  const inventoryList = reduce(
    listData,
    (ac, cu) => {
      const { inventory } = cu;
      return [
        ...ac,
        ...cu.inventory,
        // ...snakeInventory,
      ];
    },
    [],
  );
  const formattedPurchaseItemList = parsedPurchaseItemList.map((item) => {
    return { ...item };
  });
  const totalCountByName = parsedPurchaseItemList
    .map((item) => {
      return item.name;
    })
    .reduce((ac, cu) => {
      return {
        ...ac,
        [cu]: (ac[cu] || 0) + 1,
      };
    }, {});
  const currentCountByName = _.mapValues(
    totalCountByName,
    (val) => {
      return 0;
    },
  );
  const formattedInventoryList = parsedPurchaseItemList.map((item) => {
    const currentIndex = currentCountByName[item.name];
    const foundInventoryList = inventoryList.filter((v) => v.name === item.name);
    const foundInventory = foundInventoryList[currentIndex];

    if (!foundInventory) {
      return {
        ...item,
        unit_quantity: 0,
      };
    }
    currentCountByName[item.name] += 1;
    return {
      ...item,
      ...foundInventory,
      unit_quantity: convertUnit(
        item.unit_amount,
        item.unit,
        foundInventory.unitQuantity,
        true,
      ),
    };
  });
  console.log({
    inventoryList,
    formattedInventoryList,
    formattedPurchaseItemList,
    listData,
  });

  const {
    created,
    account,
  } = listData[0];
  const createdAt = moment(Number(created));
  return (
    <Wrapper>
      <LabelValue
        style={{ padding: 15 }}
        bold
        label={`기록날짜 (${account})`}
        value={`${createdAt.format('YYYY-MM-DD')}`}
      />
      <Formik
        initialValues={{
          parsedPurchaseItemList: formattedPurchaseItemList,
          inventoryList: cloneDeep(formattedInventoryList),
        }}
        onSubmit={(values) => {
          const { inventoryList } = values;
          const formattedInventoryList = inventoryList.map((v) => {
            const gramAmount = convertUnit(v.unit_amount, v.unit, v.unit_quantity);
            return {
              purchaseId: v.purchase_id,
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
          addInventoryList({ variables: { inventoryList: formattedInventoryList } });
        }}
      >
        <StyledForm>
          <DummyDataField
            purchaseList={cloneDeep(parsedPurchaseItemList)}
            name="inventoryList"
          />
          <PageAction actions={[]}>
            <Button type="submit" label="저장" loaderStroke="white" loaderSize={32} loading={addInventoryListLoading} />
          </PageAction>
          <div style={{ padding: `${(50 + 15 + 15) / 2}px 0px` }} />
        </StyledForm>
      </Formik>
    </Wrapper>
  );
};

export default Inventory;
