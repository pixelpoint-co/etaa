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

import moment from 'moment';
import Flex from '../../atoms/Flex';
import Button from '../../atoms/Button';
import Heading from '../../atoms/Heading';
import Card from '../../atoms/Card';
import AntDList from '../AntDList';

import Divider from '../../atoms/Divider';

import usePotController from '../../../hooks/usePotController';
import useOrderData from '../../../hooks/useOrderData';

const OrderListCard = styled(Card)`
  `;

const OrderListSection = styled(Card)`
    background-color: ${palette(
    'grayscale',
    4,
  )};
    padding: 10px 20px;
  `;
const PotGridContainer = styled(Flex)`
    margin: -10px 0px;
    flex-wrap: wrap;
    flex: 0;
    flex-basis: 640px;
  `;

const orderButtonProps = {
  ORDER_IN: { // 주문 승인 대기
    label: '승인 대기',
    disabled: true,
    palette: 'green',
  },
  ORDER_ACCEPTED: { // 주문 승인
    label: '레시피 선택',
    disabled: false,
  },
  ORDER_WAITING: { // 조리 대기
    label: '조리 준비중',
    disabled: false,
    palette: 'yellow',
  },
  ORDER_COOKING: { // 조리중
    label: '조리중',
    disabled: true,
    palette: 'red',

  },
  ORDER_COOKED: { // 조리끝
    label: '조리완료',
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
    onClickOrderPrepare,
    ...others
  } = props;
  return (
    <OrderListCard>
      <AntDList
      // bordered
        header={(
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          >
            <h1>{order ? order.orderNo : null}</h1>
            {/* <div>
              {
                order ? moment().format(order.dateTime) : null
              }
            </div> */}
            <div>
              <Button
                palette="grayscale"
                tone={2}
                onClick={onClickOrderChange}
              >
                주문 변경
              </Button>
            </div>
          </div>
        )}
        footer={(
          <OrderListSection palette="grayscale" tone={4}>
            {order ? order.requestCustomer : null}
          </OrderListSection>
        )}
        RowComponent={(d) => (
          <div>

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
                      <h2>{d.item}</h2>
                      <Button
                        palette="grayscale"
                        themeType="outline"
                        tone={2}
                        onClick={() => onClickOrderPrepare(d)}
                        {...orderButtonProps[get(
                          d,
                          'orderKitchen.status',
                        )]}
                      />
                    </span>
                  )
                    : (
                      d.item
                    )}
                </span>

              ) : (
                <>
                  <Divider />
                  <span style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                  >
                    <h2>{d.item}</h2>
                    {d.orderKitchen ? (
                      <Button
                        palette="grayscale"
                        themeType="outline"
                        tone={0}
                        onClick={() => onClickOrderPrepare(d)}
                        {...orderButtonProps[get(
                          d,
                          'orderKitchen.status',
                        )]}
                      />
                    ) : null}
                  </span>

                </>
              )
            }
          </div>
        )}
        dataSource={orderItems || null}
      />

    </OrderListCard>
  );
};

OrderSelection.propTypes = {
  onClickOrderChange: (v) => v,
  onClickOrderPrepare: (v) => v,
};
OrderSelection.defaultProps = {
  onClickOrderChange: PropTypes.func,
  onClickOrderPrepare: PropTypes.func,
};

export default OrderSelection;
