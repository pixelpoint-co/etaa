import {
  Formik, useField, Form,
} from 'formik';

import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

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
import {
  useState,
} from 'react';
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
import Select from '../../components/molecules/Select';
import ModelSelect from '../../containers/ModelSelect';

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
// addInventoryList(inventoryList: [InventoryInput])       : [Inventory]
// const ADD_INVETORY_LIST = gql`
//   mutation AddInventoryList($inventoryList: [InventoryInput]) {
//     addInventoryList(inventoryList: $inventoryList) {
//       id,
//       name,
//     }
//   }
// `;

// addPurchase(detail:JSON, account:String, company:String): Purchase
const ADD_PURCHASE = gql`
  mutation AddPurchase(
    $detail: JSON,
    $account: String,
    $company: String,
  ) {
    addPurchase(account: $account, detail: $detail, company: $company) {
      account,
      detail,
      company,
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
const SelectField = (props) => {
  const [
    field,
    meta,
    helpers,
  ] = useField(props);
  const { value } = meta;
  const { setValue } = helpers;
  return (
    <Select
      style={{ marginBottom: 20 }}
      {...props}
      value={value}
      onChange={(v) => setValue(v)}
    />
  );
};

const keyToLabel = {
  productId: '재료명',
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

const Purchase = () => {
  const { id } = useParams();
  const isCreate = !id;
  const navigate = useNavigate();

  const onAddPurchaseCompleted = () => {
    alert('성공');

    navigate('/purchase');
  };

  const [
    addPurchase,
    {
      loading: addPurchaseLoading,
      error: addPurchaseError,
    },
  ] = useMutation(
    ADD_PURCHASE,
    { onCompleted: onAddPurchaseCompleted },
  );

  const [
    customSellers,
    setCustomSellers,
  ] = useState([]);

  return (
    <Wrapper>
      <Formik
        initialValues={{
          createdBy: '',
          seller: '',
          store: 'RN',
          orderDate: moment().format('YYYY-MM-DD'),
          purchaseList: [{
            productId: null,
            unit: 'g',
            unitPrice: null, // 개당 가격
            unitAmount: null, // 개당 용량
            unitQuantity: null, // 수량
          }],
        }}
        onSubmit={(values) => {
          console.log(values);
          const purchaseList = values.purchaseList || [];

          const parsedValues = purchaseList.map((purchase) => {
            const {
              account,
              company,
              ...others
            } = purchase;
            return {
              ...others,
              productId: purchase.productId?.value,
              name: purchase.productId?.label,
              createdBy: values.createdBy,
              orderDate: values.orderDate,
              unitWeight: `${purchase.unitAmount}${purchase.unit}`,
            };
          });
          const filteredValues = parsedValues.filter((v) => {
            return v.productId && v.unitQuantity && v.unitPrice && v.unitAmount;
          });
          const snakeValues = filteredValues
            .map((value) => _.mapKeys(
              value,
              (v, k) => _.snakeCase(k),
            ));

          addPurchase({
            variables: {
              detail: snakeValues,
              account: null,
              company: values.seller,
            },
          });
        }}
      >
        <StyledForm>
          <StyledCard style={{ padding: 20 }}>
            <InputField
              name="createdBy"
              placeholder="작성자"
              label="작성자"
              required
            />
            <SelectField
              name="seller"
              label="구매처"
              placeholder="구매처"
              allowAddItem
              items={[
                '오더히어로',
                '크레오코리아',
                '코스트코',
                ...customSellers,
              ]}
              onAddItem={(item) => {
                setCustomSellers([
                  ...customSellers,
                  item,
                ]);
              }}
              required
            />
            <InputField
              name="store"
              placeholder="매장"
              label="매장"
              disabled
              required
            />
            <InputField
              name="orderDate"
              type="date"
              placeholder="구매날짜"
              label="구매날짜"
              required
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
              loading: addPurchaseLoading,
              palette: 'primary',
            }]}
          />
        </StyledForm>
      </Formik>
    </Wrapper>
  );
};

export default Purchase;
