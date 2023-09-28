import styled from 'styled-components';
import moment from 'moment';

import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import Link from '../../components/atoms/Link';

import PurchaseRow from '../../components/organisms/PurchaseRow';
import AntDList from '../../components/organisms/AntDList';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
`;
const StyledList = styled(AntDList)`
  flex: 1;
`;

const today = moment().startOf('day');
const startDate = today.subtract(
  3,
  'days',
);
const endDate = moment().endOf('day');

const PurchaseRowLink = (props) => {
  const { data } = props;
  console.log(data);
  // const todayStart = moment(Number(data.created)).startOf('day').toISOString();
  // const todayEnd = moment(Number(data.created)).endOf('day').toISOString();
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
  const listSource = [].map((d) => ({ data: d }));
  return (
    <Wrapper>
      <Button
        link="/inventory/"
        label="sdf"
      />
      <StyledList
        dataSource={listSource}
        RowComponent={PurchaseRowLink}
      />
    </Wrapper>
  );
};

export default Inventory;
