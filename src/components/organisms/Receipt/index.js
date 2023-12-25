import styled from 'styled-components';
import { palette } from 'styled-tools';

import moment from 'moment';
import { Fragment } from 'react';
import EKStatusTag from '../EKStatusTag';
import Flex from '../../atoms/Flex';
import Card from '../../atoms/Card';
import Icon from '../../atoms/Icon';
import Ripped from '../../molecules/Ripped';
import Text from '../../atoms/P';
import PlatformImage from '../../atoms/PlatformImage';
import Button from '../../atoms/Button';

const ReceiptContainer = styled(Flex)`
  flex: 0;
  flex-basis: 1px;
  display: inline-flex;
  writing-mode: vertical-lr;
  flex-wrap: wrap;
  align-content: flex-start;
  align-self: stretch;
  padding-bottom: 20px;
`;
const ReceiptInnerSection = styled(Flex)`
  flex-direction: column;
  flex: 0;
  margin: 0px 10px;
  writing-mode: horizontal-tb;
  width: 350px;
`;
const ReceiptHeader = styled(Card)`
  border-bottom: none;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  z-index: 1;
  padding: 20px;
  padding-bottom: 12px;
  justify-content: stretch;
  flex-direction: row;
`;
const HaederContent = styled(Flex)`
  flex-direction: column;
  flex: 1;
  /* margin-bottom: 10px; */
`;
const HeaderContentRow = styled(Flex)`
  flex: 1;
  align-items: center;
`;
const BrandIcon = styled(Icon)`

`;
const ChannelNumber = styled(Text)`
  margin-left: 20px;
  font-weight: 600;
  font-size: 30px;
  line-height: 30px;
`;
const DateText = styled(Text)`
  font-size: 20px;
  margin-left: 5px;
  color: ${palette(
    'grayscale',
    2,
  )};
`;
const HeaderAction = styled(Flex)`
  margin-left: auto;
  align-self: flex-start;
  flex: 0;
  margin-left: 8px;
`;

const MenuSection = styled(Flex)`
`;
const StyledRipped = styled(Ripped)`
  flex-direction: column;
  padding: 6px 20px;
`;
const OptionSection = styled(Flex)`
  flex-direction: column;
  margin-top: 5px;
`;
const MenuName = styled(Text)`
  font-weight: 600;
  color: ${palette(
    'grayscale',
    0,
  )};
  font-size: 22px;
  line-height: 26px;
`;
const OptionName = styled(Text)`
  font-weight: 400;
  color: ${palette(
    'grayscale',
    2,
  )};
  font-size: 20px;
  line-height: 30px;
`;

const ReceiptFooter = styled(Ripped)`
  border-top: none;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-radius: 0px 0px 15px 15px;
  padding: 20px;
  padding-top: 10px;
  z-index: 1;
`;
const CustomerRequest = styled(Card)`
  border: 2px solid ${palette(
    'grayscale',
    5,
  )};
`;
const CustomerRequestText = styled(Text)`
  font-weight: 400;
  color: ${palette(
    'grayscale',
    2,
  )};
  font-size: 20px;
  line-height: 26px;
`;
const TagSection = styled(Flex)`
  margin: 5px 0px;
  flex: 1;
  justify-content: flex-start;
`;
const lastFour = (str) => (str.length > 4 ? `...${str?.slice(-4)}` : str);
const ORDER_TYPE_LABEL = {
  ORDER_DELIVERY: '배달',
  ORDER_HALL: '홀',
  ORDER_TAKEOUT: '포장',
  ORDER_CANCEL: '취소',
};
const Receipt = (props) => {
  const {
    order,
    activeStatusById,
    completedJobsById,
    recipeData,
    completeOrder,
    hideComplete,
    onClickOrderKitchenTag,
    ...other
  } = props;

  const mainOrderItemList = order.orderItem.filter((oi) => oi.parentId == null);
  return (
    <ReceiptContainer key={order.id}>

      {order.orderItem.filter((oi) => oi.parentId == null).map((orderItem, i) => {
        const option = order.orderItem.filter((oi) => oi.parentId === orderItem.id);

        return (
          <ReceiptInnerSection key={orderItem.id} {...other}>
            {i === 0 ? (
              <ReceiptHeader palette="grayscale">
                <HaederContent>
                  <HeaderContentRow>
                    {/* <BrandIcon size={36} /> */}
                    <ChannelNumber>
                      {lastFour(order.channelNumber || order.outsideId)}
                    </ChannelNumber>
                  </HeaderContentRow>
                  <HeaderContentRow style={{ marginTop: 10 }}>
                    <Icon size="22" icon="clock" palette="grayscale" tone={3} style={{ margin: 5 }} />
                    <DateText>
                      {moment(order.date)
                        .format('HH:mm')}
                    </DateText>
                    <PlatformImage
                      platform={order.platform}
                      style={{ marginLeft: 15 }}
                    />
                    <DateText>
                      {ORDER_TYPE_LABEL[order.type]}
                    </DateText>
                  </HeaderContentRow>
                </HaederContent>

                {!hideComplete ? (
                  <HeaderAction>
                    <Button hideLabelOnLoading label="완료" palette="black" isAsync onClick={async () => completeOrder(order.id)} />
                  </HeaderAction>
                ) : null}
              </ReceiptHeader>
            ) : null}
            <StyledRipped ripTop={i !== 0}>
              {i === 0 ? (
                <Flex style={{ padding: 5 }} />
              ) : null}
              <MenuName>{orderItem.name}</MenuName>
              {orderItem.orderKitchen ? (
                <TagSection>
                  <EKStatusTag
                    orderKitchen={orderItem.orderKitchen}
                    activeStatusById={activeStatusById}
                    completedJobsById={completedJobsById}
                    recipeData={recipeData}
                    {...(onClickOrderKitchenTag
                      ? { onClick: () => onClickOrderKitchenTag(orderItem.orderKitchen) }
                      : {})}
                  />
                </TagSection>
              ) : null}
              <OptionSection>
                {option.map((option) => (
                  <Fragment key={option.id}>
                    <OptionName>{option.name}</OptionName>
                    {option.orderKitchen ? (
                      <TagSection>
                        <EKStatusTag
                          orderKitchen={option.orderKitchen}
                          activeStatusById={activeStatusById}
                          completedJobsById={completedJobsById}
                          recipeData={recipeData}
                          {...(onClickOrderKitchenTag
                            ? { onClick: () => onClickOrderKitchenTag(option.orderKitchen) }
                            : {})}
                        />
                      </TagSection>
                    ) : null}
                  </Fragment>
                ))}
              </OptionSection>
            </StyledRipped>
          </ReceiptInnerSection>
        );
      })}
      <ReceiptInnerSection>
        <ReceiptFooter ripBottom={false}>
          <CustomerRequest>
            <CustomerRequestText>
              {order.customerRequest}
            </CustomerRequestText>
          </CustomerRequest>
        </ReceiptFooter>
      </ReceiptInnerSection>
    </ReceiptContainer>
  );
};

export default Receipt;
