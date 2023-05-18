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
import Divider from '../../atoms/Divider';
import IconButton from '../../molecules/IconButton';
import ProgressBar from '../../molecules/ProgressBar';

const Container = styled(Card)`
  padding: 20px;
  margin-bottom: 15px;
  flex-direction: column;
  width: 100%;
  flex: 1;
`;
const ExpandContainer = styled(Flex)`
  margin: -5px;
  margin-top: 15px;
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
  margin-top: 7px;
`;
const OrderDestination = styled(Flex)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
const OrderProgress = styled(Flex)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex: 0;
`;
const OrderProgressStep = styled(Flex)`
  flex-direction: column;
  flex-basis: 120px;
  max-width: 120px;
  min-width: 120px;
  margin: 0px 5px;
`;
const ToggleSection = styled(Flex)`
  margin-left: 20px;
  flex: 0;
`;
const ToggleButton = styled(IconButton)`
`;
const HeaderText = styled(Text)`
  font-size: 30px;
  line-height: 30px;
  font-weight: 500;
`;
const ArrowTailContainer = styled(IconButton)`
  padding: 5px;
  border-radius: 20px;
  margin: 0px 10px;
  align-self: center;
`;
const HeaderSubText = styled(Text)`
  font-size: 24px;
  line-height: 24px;
  font-weight: 500;
  margin-left: 20px;
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

  const companyText = (company && account) ? ` - ${company}` : '';
  const isComplete = inventoryList.length > 0;
  return (
    <Container>
      <HeaderSection>
        <OrderDestination>
          <HeaderText>
            {`${company || ''}`}
          </HeaderText>
          <ArrowTailContainer icon="arrowTail" palette="grayscale" tone={5} />
          <HeaderText>
            RN
          </HeaderText>
          <HeaderSubText>
            {`${account || ''}`}
          </HeaderSubText>
        </OrderDestination>
        <OrderProgress>
          <OrderProgressStep>
            <Text>발주신청</Text>
            <ProgressBar size={5} percentage={100} />
          </OrderProgressStep>
          <OrderProgressStep>
            <Text>발주승인</Text>
            <ProgressBar size={5} percentage={isComplete ? 100 : 0} />
          </OrderProgressStep>
          <OrderProgressStep>
            <Text>입고확정</Text>
            <ProgressBar size={5} percentage={isComplete ? 100 : 0} />
          </OrderProgressStep>
        </OrderProgress>
        <ToggleSection>
          <ToggleButton icon="arrow" rotateDeg={0} palette="grayscale" tone={5} />
        </ToggleSection>
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
                    value={(
                      <Flex>
                        <Text palette="black">
                          {`${inventoryAmount}${inventoryUnit}`}
                        </Text>
                        <Divider direction="vertical" size={16} width={2} horizontalMargin={10} />
                        <Text>
                          {`${convertedInventoryQuantity || 0}`}
                        </Text>
                        <Text>
                          {' / '}
                        </Text>
                        <Text palette="grayscale">
                          {`${purchaseQuantity}`}
                        </Text>
                      </Flex>
                    )}
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
          label="발주취소"
          disabled
        />
        <Button
          palette="primary"
          style={{
            minWidth: 200,
            marginLeft: 10,
          }}
          to={`/inventory/edit/${id}`}
          label="입고확인"
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
