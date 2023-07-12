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
                        tone={5}
                        onClick={onClickOrderPrepare}
                      >
                        조리준비
                      </Button>
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
                        tone={5}
                        onClick={onClickOrderPrepare}
                      >
                        조리준비
                      </Button>
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
