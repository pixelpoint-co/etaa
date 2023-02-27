import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  groupBy,
  get,
} from 'lodash';
import { palette } from 'styled-theme';
import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';
import Card from '../../atoms/Card';
import LabelValue from '../../molecules/LabelValue';
import AntDList from '../AntDList';

import {
  unformat,
  roundTo,
  convertUnit,
} from '../../../services/number';

const StyledText = styled(Text)`

`;
const Container = styled(Card)`
  flex-direction: column;
  width: 100%;
  flex: 1;
`;

const ExpandContainer = styled(AntDList)`
  width: 100%;
`;

const PurchaseItemContainer = styled(Flex)`
  fle-direction: column;
`;

const PurchaseRow = (props) => {
  const {
    data,
    ...others
  } = props;
  const {
    detail,
    inventory: inventoryList,
    created,
    account,
  } = data;
  const createdAt = moment(Number(created));

  const groupedByDate = groupBy(detail, 'order_date');

  console.log(props);
  console.log(groupedByDate);
  return (
    <Container>
      <LabelValue
        bold
        label={`기록날짜 (${account})`}
        value={`${createdAt.format('YYYY-MM-DD')}`}
      />
      <ExpandContainer>
        {detail.map((purchaseItem) => {
          const { name } = purchaseItem;
          console.log(purchaseItem);
          console.log(inventoryList);
          const [foundInventory] = inventoryList
            .filter((inventoryItem) => inventoryItem.name === name);
          console.log(foundInventory, purchaseItem);
          const inventoryQuantity = get(foundInventory, 'unitQuantity');
          const convertedInventoryQuantity = convertUnit();
          return (
            <PurchaseItemContainer key={name}>
              <LabelValue
                label={name}
                value={`(${inventoryQuantity || 0})`}
              />
            </PurchaseItemContainer>
          );
        })}
      </ExpandContainer>
    </Container>
  );
};

PurchaseRow.propTypes = {
  data: PropTypes.shape({
    detail: PropTypes.array,
    id: PropTypes.number,
    created: PropTypes.string,
  }),

};

PurchaseRow.defaultProps = { data: null };

export default PurchaseRow;
