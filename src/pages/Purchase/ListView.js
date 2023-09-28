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

import Flex from '../../components/atoms/Flex';
import Link from '../../components/atoms/Link';

import PurchaseRow from '../../components/organisms/PurchaseRow';
import AntDList from '../../components/organisms/AntDList';
import PageAction from '../../components/organisms/PageAction';

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
  margin-top: 20px;
`;

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
      <StyledList
        dataSource={[]}
        RowComponent={PurchaseRow}
        hideDivider
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
