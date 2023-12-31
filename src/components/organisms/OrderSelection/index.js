// import { connect } from 'react-redux';
import {
  useLocation, useParams,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import _, {
  get,
} from 'lodash';
import {
  size,
} from 'styled-theme';
import {
  palette,
} from 'styled-tools';

import Flex from '../../atoms/Flex';
import Button from '../../atoms/Button';
import Heading from '../../atoms/Heading';
import Card from '../../atoms/Card';
import AntDList from '../AntDList';

const List = styled(AntDList)`
    .ant-list-header {
        padding: 0;
    }
    .ant-list-footer {
        padding: 0;
    }
    .ant-list-items {
        margin : 20px 0px 20px 0px;
    }
`;

const OrderListCard = styled(Card)`
  padding : 14px;
  flex-basis: 100%;
  flex-grow: 0;
  overflow: auto;
`;

const OrderListSection = styled(Card)`
    background-color: ${palette(
    'grayscale',
    5,
  )};
    color: ${palette(
    'grayscale',
    2,
  )};
    padding: 10px 20px;
    font-size : 20px;
  `;

const CookPrepareButton = styled(Button)`
    padding: 10px 40px;
    color: ${palette(
    'grayscale',
    2,
  )};

`;
const PotGridContainer = styled(Flex)`
    margin: -10px 0px;
    flex-wrap: wrap;
    flex: 0;
    flex-basis: 640px;
  `;

const orderButtonProps = {
  ORDER_IN: { // 주문 승인 대기
    label: '승인대기',
    disabled: true,
    palette: 'green',
  },
  ORDER_ACCEPTED: { // 주문 승인
    label: '레시피선택',
    palette: 'green',
    disabled: false,
  },
  ORDER_WAITING: { // 조리 대기
    label: '조리준비',
    disabled: false,
    palette: 'yellow',
  },
  ORDER_COOKING: { // 조리중
    label: '조리',
    disabled: false,
    palette: 'red',
  },
  ORDER_COOKED: { // 조리끝
    label: '완료',
    disabled: true,
  },
};

// ORDER_IN            : 1,    // 1  주문이 들어온 상태
// ORDER_ACCEPTED      : 10,   // 10 주문 승인
// ORDER_WAITING       : 20,   // 20 쉐프가 진행해야 할 주문 상태 (조리 가능한 팟 수 이상 웨이팅이 되지 않음, 순서 변경 불가)
// ORDER_COOKING       : 31,   // 31 조리 진행중 (순서 변경 불가)
// ORDER_COOKED        : 91,   // 91 조리 완료
// ORDER_PICKUP        : 92,   // 92 픽업 완료
// ORDER_CAFE          : 93,   // 93 카페 메뉴만 들어왔을때
// ORDER_CANCEL        : 41,   // 41 취소

const OrderSelection = (props) => {
  const {
    order,
    orderItems,
    onClickOrderChange,
    chefMonitoringData,
    onClickOrderPrepare,
    ...others
  } = props;
  console.log({
    order,
    orderItems,
  });
  return (
    <OrderListCard>
      <List
        // style={{ padding: 14 }}
        // bordered
        header={(
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 60,
          }}
          >
            <h1>{order ? order.outsideId : null}</h1>
            {/* <div>
              {
                order ? moment().format(order.dateTime) : null
              }
            </div> */}
            <div>
              <Button
                style={{ padding: '10px 40px' }}
                palette="grayscale"
                tone={2}
                onClick={onClickOrderChange}
              >
                주문 선택
              </Button>
            </div>
          </div>
        )}
        footer={(
          <>{order ? (order.customerRequest !== '' ? <OrderListSection>{order.customerRequest}</OrderListSection> : null) : null}</>
        )}
        RowComponent={(d) => {
          const meta = get(
            d,
            [
              'orderKitchen',
              'meta',
            ],
            {},
          );
          const matchingPot = d.pot;
          console.log({
            d,
            meta,
            matchingPot,
          });
          return (
            <div style={{ fontSize: 20 }}>
              {
                d.isSubMenu ? (
                  <span>
                    {d.orderKitchen ? (

                      <span style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      >
                        <Heading style={{ marginBottom: 0 }}>{d.name}</Heading>
                        <CookPrepareButton
                          palette="grayscale"
                          themeType="outline"
                          tone={0}
                          onClick={() => onClickOrderPrepare(d.orderKitchen)}
                          {...(
                            orderButtonProps[
                              get(
                                d,
                                [
                                  'orderKitchen',
                                  'meta',
                                  'cookerId',
                                ],
                              ) > -1 ? 'ORDER_WAITING' : null
                            ]
                              || orderButtonProps.ORDER_ACCEPTED
                          )}
                        />
                      </span>
                    )
                      : (
                        d.name
                      )}
                  </span>

                ) : (
                  <div>
                    {/* <Divider /> */}
                    <span
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 20,
                      }}
                    >
                      <Heading style={{ marginBottom: 0 }}>{`${d.name}`}</Heading>
                      {d.orderKitchen ? (
                        <CookPrepareButton
                          palette="grayscale"
                          themeType="outline"
                          tone={0}
                          onClick={() => onClickOrderPrepare(d.orderKitchen)}
                          {...(
                            orderButtonProps[
                              get(
                                d,
                                [
                                  'orderKitchen',
                                  'meta',
                                  'cookerId',
                                ],
                              ) > -1 ? 'ORDER_WAITING' : null
                            ]
                              || orderButtonProps.ORDER_ACCEPTED
                          )}
                        />
                      ) : null}
                    </span>
                  </div>
                )
              }
            </div>
          );
        }}
        dataSource={orderItems || null}
      />

    </OrderListCard>
  );
};

OrderSelection.propTypes = {
  onClickOrderChange: PropTypes.func,
  onClickOrderPrepare: PropTypes.func,
};
OrderSelection.defaultProps = {
  onClickOrderChange: (v) => v,
  onClickOrderPrepare: (v) => v,
};

export default OrderSelection;
