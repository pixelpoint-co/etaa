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
import Input from '../../components/molecules/Input';
import Flex from '../../components/atoms/Flex';
import Text from '../../components/atoms/P';
import Button from '../../components/atoms/Button';
import LabelValue from '../../components/molecules/LabelValue';
import usePurchaseData from '../../hooks/usePurchaseData';
import PurchaseItemInput from '../../components/organisms/PurchaseItemInput';
import PageAction from '../../components/organisms/PageAction';

import {
  unformat, roundTo, convertUnit,
} from '../../services/number';
import AntDList from '../../components/organisms/AntDList';
import Card from '../../components/atoms/Card';

const Wrapper = styled(Flex)`
  flex: 1;
  margin: 20px;
  flex-direction: column;
  @media (max-width: ${size('mobileBreakpoint')}) {
    overflow-x: auto;
  }
`;

const StyledCard = styled(Card)`
  flex: 0;
`;
const HeaderContainer = styled(Flex)`
  padding: 10px 0px;
`;
const HeaderCell = styled(Text)`
  margin: 0px 20px;
  flex: 1;
  text-align: left;
  font-size: 18px;
  line-height: 18px;
`;
const StyledForm = styled(Form)`
  display: flex;
  flex: 1;
  max-width: 100%;
  flex-direction: column;
`;
const StyledInput = styled(Input)`
`;
const ADD_INVETORY_LIST = gql`
  mutation AddPurchaseList($inventoryList: [PurchaseInput]) {
    addPurchaseList(inventoryList: $inventoryList) {
      id,
      name,
    }
  }
`;
const DDContainer = styled(Flex)`
  flex-direction: column;
  margin-top: 20px;
`;
const InputField = (props) => {
  const [
    field,
    meta,
    helpers,
  ] = useField(props);
  const { value } = meta;
  const { setValue } = helpers;
  return (
    <StyledInput
      inputStyle={{ marginBottom: 20 }}
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
const keyToLabel = {
  name: '상품명',
  unitAmount: '용량',
  unit: '단위',
  unitQuantity: '구매 수량',
  unitPrice: '구매 가격',
};

const PurchaseListField = (props) => {
  const [
    field,
    meta,
    helpers,
  ] = useField(props);
  const { value: purchaseList } = meta;
  const onChange = helpers.setValue;
  const labels = Object.keys(keyToLabel);
  return (
    <DDContainer>
      <StyledCard>
        <AntDList
          header={(
            <HeaderContainer>
              {labels.map((label) => (
                <HeaderCell
                  key={label}
                >
                  {keyToLabel[label]}
                </HeaderCell>
              ))}
            </HeaderContainer>
          )}
          horizontalMargin={20}
          RowComponent={PurchaseItemInput}
          dataSource={purchaseList.map((
            purchaseItemData,
            i,
          ) => ({
            data: purchaseItemData, // reserved keyword
            // other props
            onChange: (newVal) => {
              const newData = cloneDeep(purchaseList);
              newData[i] = newVal;
              onChange(newData);
            },
            onChangeKey: (key) => (newVal) => {
              const newData = cloneDeep(purchaseList);
              newData[i][key] = newVal;
              onChange(newData);
            },
          }))}
        />
        <Button
          style={{
            fontSize: 22,
            lineHeight: '22px',
            margin: '0px 20px 20px 20px',
          }}
          palette="grayscale"
          label="추가"
          onClick={() => onChange([
            ...purchaseList,
            {},
          ])}
        />
      </StyledCard>
    </DDContainer>
  );
};

const today = moment().toISOString(); // TODO waiter db.Timestamp에 따라 수동으로 UTC기준으로 전환

const Purchase = () => {
  const { id } = useParams();
  const isCreate = !id;
  const {
    purchaseData: data,
    purchaseListData: listData,
    loading,
    error,
  } = usePurchaseData({
    id,
    created: today,
    startDate: moment(today).subtract(
      1,
      'day',
    ),
    endDate: today,
    type: 'many',
  });
  // const {
  //   id,
  //   detail: purchaseItemList,
  //   inventory: inventoryList,
  // } = data;
  const addPurchaseListCompleted = () => {
    console.log('add inventory db');
    alert('기록되었습니다');
  };

  const [
    addPurchaseList,
    {
      loading: addPurchaseListLoading,
      error: addPurchaseListError,
    },
  ] = useMutation(
    ADD_INVETORY_LIST,
    { onCompleted: addPurchaseListCompleted },
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
        // ...snakePurchase,
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
    .reduce(
      (ac, cu) => {
        return {
          ...ac,
          [cu]: (ac[cu] || 0) + 1,
        };
      },
      {},
    );
  const currentCountByName = _.mapValues(
    totalCountByName,
    (val) => {
      return 0;
    },
  );

  return (
    <Wrapper>
      <Formik
        initialValues={{
          createdBy: '',
          seller: '',
          store: '',
          purchaseDate: moment().format('MM-DD-YYYY HH:mm:ss'),
          purchaseList: [{
            name: '',
            unit: '',
            unitPrice: 0, // 개당 가격
            unitAmount: 0, // 개당 용량
            unitQuantity: 0, // 수량
          }],
        }}
        onSubmit={(values) => {
          console.log(values);
          // const { inventoryList } = values;
          // const formattedPurchaseList = inventoryList.map((v) => {
          //   const gramAmount = convertUnit(
          //     v.unit_amount, v.unit, v.unit_quantity,
          //   );
          //   return {
          //     purchaseId: v.purchase_id,
          //     id: v.id,
          //     name: v.name,
          //     unitQuantity: gramAmount,
          //     // unitWeight: 'g',
          //     unitPrice: roundTo(
          //       unformat(v.unit_price) / gramAmount,
          //       4,
          //     ),
          //   };
          // });
          // addPurchaseList({ variables: { inventoryList: formattedPurchaseList } });
        }}
      >
        <StyledForm>
          <StyledCard style={{ padding: 20 }}>
            <InputField
              name="createdBy"
              placeholder="작성자"
              label="작성자"
            />
            <InputField name="seller" placeholder="구매처" label="구매처" />
            <InputField name="store" placeholder="매장" label="매장" />
            <InputField
              name="orderDate"
              placeholder="구매날짜"
              label="구매날짜"
              inputStyle={{ marginBottom: 0 }}
            />

          </StyledCard>
          <PurchaseListField
            name="purchaseList"
            label=""
          />
          <PageAction
            actions={[{
              type: 'submit',
              label: '저장',
              loaderStroke: 'white',
              loaderSize: 32,
              loading: addPurchaseListLoading,
              palette: 'primary',
            }]}
          />
          <div style={{ padding: `${(50 + 30 + 30) / 2}px 0px` }} />
        </StyledForm>
      </Formik>
    </Wrapper>
  );
};

export default Purchase;
