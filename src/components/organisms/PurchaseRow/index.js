import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  groupBy,
  get,
} from 'lodash';
import {
  palette,
} from 'styled-theme';
import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';
import Card from '../../atoms/Card';
import LabelValue from '../../molecules/LabelValue';
import Button from '../../atoms/Button';

import {
  convertUnit,
} from '../../../services/number';

const Container = styled(Card)`
  padding: 20px;
  margin-bottom: 15px;
  flex-direction: column;
  width: 100%;
  flex: 1;
`;
const ExpandContainer = styled(Flex)`
  margin: -5px;
  margin-top: 25px;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
`;
const PurchaseItemContainer = styled(Flex)`
  padding: 5px;
  flex: 0;
  flex-basis: 50%;
`;
const PurchaseItem = styled(Flex)`
  padding: 15px 20px;
  border-radius: 15px;
  border: 2px solid ${palette(
    'grayscale',
    5,
  )};
`;
const HeaderSection = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const HeaderText = styled(Text)`
  font-size: 30px;
  line-height: 30px;
  font-weight: 500;
`;
const HeaderSubText = styled(Text)`
  font-size: 24px;
  line-height: 24px;
  font-weight: 500;
  color: ${palette(
    'grayscale',
    3,
  )};
`;
const ItemName = styled(Text)`
font-size: 22px;
line-height: 22px;
font-weight: 400;
`;
const ProductName = styled(ItemName)`
  color: ${palette(
    'grayscale',
    4,
  )};
`;
const ButtonContainer = styled(Flex)`
  justify-content: flex-end;
  margin-top: 15px;
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
    company,
    account,
    id,
  } = data;
  const createdAt = moment(Number(created));

  const groupedByDate = groupBy(
    detail,
    'order_date',
  );

  console.log(data);
  console.log(groupedByDate);
  const companyText = (company && account) ? ` - ${company}` : '';
  return (
    <Container>
      <HeaderSection>
        <HeaderText>
          {`${company || ''}`}
        </HeaderText>
        <HeaderSubText>
          {`${account || ''}`}
        </HeaderSubText>
      </HeaderSection>
      {detail.length > 0 ? (
        <ExpandContainer>
          {detail.map((purchaseItem) => {
            const { name } = purchaseItem;
            const [foundInventory] = inventoryList
              .filter((inventoryItem) => inventoryItem.name === name);
            const inventoryQuantity = get(
              foundInventory,
              'unitQuantity',
            );
            const purchaseQuantity = get(
              purchaseItem,
              'unit_quantity',
            );
            const inventoryAmount = get(
              purchaseItem,
              'unit_amount',
            );
            const inventoryUnit = get(
              purchaseItem,
              'unit',
            );
            const convertedInventoryQuantity = convertUnit(
              inventoryAmount,
              inventoryUnit,
              inventoryQuantity,
              true,
            );
            console.log(`inventoryAmount: ${inventoryAmount}`);
            console.log(`inventoryUnit: ${inventoryUnit}`);
            console.log(`inventoryQuantity: ${inventoryQuantity}`);
            console.log(`convertedInventoryQuantity: ${convertedInventoryQuantity}`);
            return (
              <PurchaseItemContainer key={name}>
                <PurchaseItem>
                  <LabelValue
                    style={{
                      padding: 0,
                      fontSize: 22,
                      lineHeight: '22px',
                    }}
                    label={name}
                    value={`(${convertedInventoryQuantity || 0} / ${purchaseQuantity})${inventoryUnit}`}
                  />
                </PurchaseItem>
              </PurchaseItemContainer>
            );
          })}
        </ExpandContainer>
      ) : null}
      <ButtonContainer>
        <Button
          palette="grayscale"
          style={{ minWidth: 200 }}
          to={`/inventory/edit/${id}`}
          label="입고"
        />
      </ButtonContainer>
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
