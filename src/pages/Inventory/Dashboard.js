import {
  Formik, useField, Form,
} from 'formik';

import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';
import {
  DatePicker, Space,
} from 'antd';

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

import { withProp } from 'styled-tools';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import LabelValue from '../../components/molecules/LabelValue';
import usePurchaseData from '../../hooks/usePurchaseData';
import OrderItemInput from '../../components/molecules/OrderItemInput';
import AntDList from '../../components/organisms/AntDList';
import Card from '../../components/atoms/Card';
import PageAction from '../../components/organisms/PageAction';

import InventoryTable from '../../containers/InventoryTable';

import {
  unformat, roundTo, convertUnit,
} from '../../services/number';
import IconCard from '../../components/molecules/IconCard';
import Heading from '../../components/atoms/Heading';
import Divider from '../../components/atoms/Divider';

import SaleSummary from '../../components/organisms/SaleSummary';

const { RangePicker } = DatePicker;

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
  padding: 20px;
`;

const OverViewCard = styled(Card)`
  flex-direction: column;
  flex: 1;
  margin: 16px 0px;
  padding: 16px;
`;
const OverViewHeader = styled(Flex)`
  flex-direction: row;

`;
const HeadingContainer = styled(Flex)`
  min-height: 90px;
  align-items: center;
  justify-content: space-between;
`;
const StyledHeading = styled(Heading)`
  font-size: 22px;
  line-height: 22px;
`;
const OverViewStatsContainer = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  margin: 0px -10px 30px -10px;
`;
const OverviewStatContainer = styled(Flex)`
  margin: 0px 10px;
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
  padding: 20px;
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
    <DDContainer />
  );
};

const today = moment().toISOString(); // TODO waiter db.Timestamp에 따라 수동으로 UTC기준으로 전환

const InventoryDashboard = () => {
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
  console.log('입고');

  const {
    created,
    account,
  } = listData[0];
  const createdAt = moment(Number(created));
  return (
    <Wrapper>
      <HeadingContainer>
        <StyledHeading level={3}>
          Overview
        </StyledHeading>
        <RangePicker
          format="YYYY/MM/DD"
        />
      </HeadingContainer>
      <OverViewStatsContainer>
        <OverviewStatContainer>
          <SaleSummary
            title="사용량"
            diffTitle="지난 주"
            value={68}
            diffValue={40}
            formatValue={(v) => `${v}회`}
          />
        </OverviewStatContainer>
        <OverviewStatContainer>
          <SaleSummary
            title="출고액"
            diffTitle="지난 주"
            value={287000}
            diffValue={287000}
          />
        </OverviewStatContainer>
        <OverviewStatContainer>
          <SaleSummary
            title="총 재고 보유액"
            diffTitle="지난 주"
            value={249000}
            diffValue={227000}
          />
        </OverviewStatContainer>

      </OverViewStatsContainer>

      <HeadingContainer>
        <StyledHeading level={3}>
          판매가능재고
        </StyledHeading>

      </HeadingContainer>
      <Card style={{ padding: 16 }}>
        <InventoryTable />
      </Card>
    </Wrapper>
  );
};

export default InventoryDashboard;
