import {
  useState,
} from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import moment from 'moment';
import _ from 'lodash';
import {
  DatePicker,
} from 'antd';
import {
  gql, useMutation,
} from '@apollo/client';

import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import Link from '../../components/atoms/Link';

import usePurchaseData from '../../hooks/usePurchaseData';
import PurchaseRow from '../../components/organisms/PurchaseRow';
import AntDList from '../../components/organisms/AntDList';
import PageAction from '../../components/organisms/PageAction';

// import useButtonCollapse from '../../hooks/useButtonCollapse';

const { RangePicker } = DatePicker;

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
  margin: 20px;
`;
const FilterSection = styled(Flex)`
  flex: 0;
  justify-content: flex-end;
`;

const StyledList = styled(AntDList)`
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

const PurchaseRowLink = (props) => {
  const { data } = props;
  console.log(data);
  return (
    <Link
      fill
      to={`/inventory/edit/${data.id}`}
      // to={`/inventory/edit/group?startDate=${todayStart}&endDate=${todayEnd}`}
    >
      <PurchaseRow {...props} />
    </Link>
  );
};

const Inventory = () => {
  const today = dayjs().startOf('day');
  const initialStartDate = today.subtract(
    7,
    'days',
  );
  const initialEndDate = dayjs().endOf('day');
  const [
    startDate,
    setStartDate,
  ] = useState(initialStartDate);
  const [
    endDate,
    setEndDate,
  ] = useState(initialEndDate);

  console.log(startDate);
  console.log(
    'initialEndDate: ',
    initialEndDate,
    endDate,
    endDate.format(),
  );

  const {
    pId,
    purchaseListData,
    loading,
    error,
    refetch,
  } = usePurchaseData({
    id: null,
    startDate: startDate.format(),
    endDate: endDate.format(),
    limit: 99,
  });

  // const {
  //   Collapse,
  //   buttonNode,
  // } = useButtonCollapse();

  const addInventoryListCompleted = () => {
    console.log('add inventory db');
  };

  const [addInventoryList] = useMutation(
    ADD_INVETORY_LIST,
    { onCompleted: addInventoryListCompleted },
  );

  if (purchaseListData == null) return null;
  if (loading) return null;
  const listSource = purchaseListData.map((d) => ({ data: d }));
  return (
    <Wrapper>
      <FilterSection>
        <RangePicker
          onChange={(dayRange, dayStringRange) => {
            setStartDate(dayRange[0].startOf('day'));
            setEndDate(dayRange[1].endOf('day'));
          }}
          value={[
            dayjs(startDate),
            dayjs(endDate),
          ]}
        />
      </FilterSection>
      {/* {buttonNode} */}
      {/* hi */}
      {/* <Collapse> */}
      <StyledList
        dataSource={listSource}
        RowComponent={PurchaseRowLink}
      />
      {/* </Collapse> */}
      <PageAction
        actions={[{
          to: '/purchase/create',
          label: '발주',
        }]}
      />
    </Wrapper>
  );
};

export default Inventory;
