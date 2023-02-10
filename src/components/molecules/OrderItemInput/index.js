import { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { palette } from 'styled-theme';
import { get } from 'lodash';
import { useField } from 'formik';

import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';
import Button from '../../atoms/Button';
import Input from '../Input';

const Wrapper = styled(Flex)`
  flex-direction: row;
  justify-content: flex-start;
  flex: 1;
  padding: 10px 5px;
  width: 100%;
`;
const CellContainer = styled(Flex)`
  flex: 0;
  margin-left: 20px;
  margin-right: 20px;
  align-items: center;
`;
const StyledText = styled(Text)`
  font-size: 32px;
  line-height: 40px;
`;
const StyledInput = styled(Input)`
  font-size: 32px;
  line-height: 40px;
  flex: 0.5;
  min-width: 50px;
  max-width: 80px;
  align-self: center;
  justify-content: flex-end;
  text-align: right;
`;
const ButtonsContainer = styled(Flex)`
  flex: 0;
  flex-basis: 100px;
  align-self: center;

`;
const OrderItemInput = ({
  orderItem,
  onChange, // onChange(v) v = { g }
  setValue,
  value, // { kg }
  ...props
}) => {
  const {
    name: orderItemName,
    order_id,
    unit_quantity,
    unit_amount,
    unit,
    created: orderItemCreated,
  } = orderItem;

  const cellKeys = [
    {
      key: 'order_id',
      cellStyle: {
        flexBasis: '120px',
        flexWrap: 'nowrap',
        whiteSpace: 'nowrap',
      },
    },
    {
      key: 'name',
      cellStyle: {
        flexBasis: '300px',
        flex: 1,
      },
    },
    {
      key: 'item_unit',
      cellStyle: { flexBasis: '120px' },
      renderer: (data) => {
        return `${data.unit_amount}${unit}`; // 1.5kg
      },
    },
    {
      key: 'unit_quantity',
      cellStyle: { flexBasis: '50px' },
    },
  ];

  const defaultRenderer = (key) => {
    return (d) => String(d[key]);
  };
  console.log(orderItem);
  return (
    <Wrapper>
      {cellKeys.map((cellKey) => {
        const { cellStyle: style = {} } = cellKey;
        const key = typeof cellKey === 'string' ? cellKey : get(cellKey, 'key');
        const renderer = typeof cellKey.renderer === 'function' ? cellKey.renderer : defaultRenderer(key);

        const cellLabel = typeof cellKey === 'string'
          ? orderItem[key]
          : renderer(orderItem);
        return (
          <CellContainer key={key} style={style}>
            <StyledText>
              {cellLabel}
            </StyledText>
          </CellContainer>
        );
      })}
      <StyledInput
        {...props}
        type="number"
        placeholder="수량"
        onChange={onChange}
        value={value}
      />
      <ButtonsContainer>
        <Button
          transparent
          palette="white"
          onClick={() => {
            setValue(Number(orderItem.unit_quantity));
          }}
        >
          <Icon icon="check" size={36} stroke="black" fill="black" />
        </Button>
        <Button
          transparent
          palette="white"
          onClick={() => {
            setValue(0);
          }}
          style={{ marginLeft: 4 }}
        >
          <Icon icon="x" size={36} stroke="black" fill="black" />
        </Button>
      </ButtonsContainer>
    </Wrapper>
  );
};

OrderItemInput.propTypes = {};

OrderItemInput.defaultProps = {};

export default OrderItemInput;
