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
    margin-top : 30px;
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
            <h1>{order ? order.orderNo : null}</h1>
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
                주문 변경
              </Button>
            </div>
          </div>
        )}
        footer={(
          <>{order ? (order.requestCustomer !== '' ? <OrderListSection>{order.requestCustomer}</OrderListSection> : null) : null}</>
        )}
        RowComponent={(d) => (
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
                      <h3>{d.item}</h3>
                      <CookPrepareButton
                        themeType="outline"
                        palette="grayscale"
                        tone={5}
                        onClick={onClickOrderPrepare}
                      >
                        레시피 선택
                      </CookPrepareButton>
                    </span>
                  )
                    : (
                      d.item
                    )}
                </span>

              ) : (
                <div>
                  {/* <Divider /> */}
                  <span style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                  >
                    <h3>{d.item}</h3>
                    {d.orderKitchen ? (
                      <CookPrepareButton
                        themeType="outline"
                        palette="grayscale"
                        tone={5}
                        onClick={onClickOrderPrepare}
                      >
                        레시피 선택
                      </CookPrepareButton>
                    ) : null}
                  </span>

                </div>
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
//   onClickOrderChange: (v) => v,
//   onClickOrderPrepare: (v) => v,
};
OrderSelection.defaultProps = {
//   onClickOrderChange: PropTypes.func,
//   onClickOrderPrepare: PropTypes.func,
};

export default OrderSelection;
