import { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  palette, size,
} from 'styled-theme';

import { get } from 'lodash';
import { useField } from 'formik';

import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';
import Button from '../../atoms/Button';
import Input from '../Input';

const Wrapper = styled.label`
  display: flex;
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
  @media (max-width: ${size('mobileBreakpoint')}) {
    margin-left: 8px;
    margin-right: 8px;
  }
  `;
const StyledText = styled(Text)`
  font-size: 32px;
  line-height: 30px;
  @media (max-width: ${size('mobileBreakpoint')}) {
    font-size: 18px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const StyledInput = styled(Input)`
  font-size: 32px;
  line-height: 40px;
  flex: 0.5;
  min-width: 80px;
  max-width: 120px;
  align-self: center;
  justify-content: flex-end;
  text-align: right;
  @media (max-width: ${size('mobileBreakpoint')}) {
    font-size: 18px;
    line-height: 24px;
  }
`;
const ButtonsContainer = styled(Flex)`
  flex: 0;
  flex-basis: 100px;
  align-self: center;
`;

const isMobile = window.innerWidth <= 1024;

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
      cellStyle: { flexBasis: '80px' },
      cellTextStyle: { whiteSpace: 'nowrap' },
    },
    {
      key: 'name',
      cellStyle: {
        flexBasis: '240px',
        flex: 1,
        minWidth: 180,
      },
    },
    {
      key: 'item_unit',
      cellStyle: { flexBasis: '80px' },
      cellTextStyle: { whiteSpace: 'nowrap' },
      renderer: (data) => {
        return `${data.unit_amount}${unit}`; // 1.5kg
      },
    },
    {
      key: 'unit_quantity',
      cellStyle: { flexBasis: '60px' },
      cellTextStyle: { whiteSpace: 'nowrap' },
    },
  ];

  const defaultRenderer = (key) => {
    return (d) => String(d[key]);
  };
  console.log(orderItem);
  return (
    <Wrapper>
      {cellKeys.map((cellKey) => {
        const {
          cellStyle = {},
          cellTextStyle = {},
        } = cellKey;
        const key = typeof cellKey === 'string' ? cellKey : get(cellKey, 'key');
        const renderer = typeof cellKey.renderer === 'function' ? cellKey.renderer : defaultRenderer(key);

        const cellLabel = typeof cellKey === 'string'
          ? orderItem[key]
          : renderer(orderItem);
        return (
          <CellContainer key={key} style={cellStyle}>
            <StyledText style={cellTextStyle}>
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
          <Icon icon="check" size={isMobile ? 24 : 36} stroke="black" fill="black" />
        </Button>
        <Button
          transparent
          palette="white"
          onClick={() => {
            setValue(0);
          }}
          style={{ marginLeft: 4 }}
        >
          <Icon icon="x" size={isMobile ? 24 : 36} stroke="black" fill="black" />
        </Button>
      </ButtonsContainer>
    </Wrapper>
  );
};

OrderItemInput.propTypes = {};

OrderItemInput.defaultProps = {};

export default OrderItemInput;
