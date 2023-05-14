import {
  useState,
} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  palette, size,
} from 'styled-theme';

import {
  get,
} from 'lodash';
import {
  useField,
} from 'formik';

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
  padding: 10px 15px;
`;
const CellContainer = styled(Flex)`
  flex: 1;
  margin-left: 20px;
  margin-right: 20px;
  align-items: center;
  @media (max-width: ${size('mobileBreakpoint')}) {
    margin-left: 8px;
    margin-right: 8px;
    min-width: 200px;
  }
`;
const StyledText = styled(Text)`
  font-size: 32px;
  line-height: 38px;
  @media (max-width: ${size('mobileBreakpoint')}) {
    font-size: 18px;
    line-height: 24px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const StyledInput = styled(Input)`
  flex: 0;
  justify-content: flex-end;
  align-self: center;

  font-size: 32px;
  line-height: 40px;

  text-align: right;

  margin-left: 20px;
  margin-right: 20px;


  min-width: 120px;

  @media (max-width: ${size('mobileBreakpoint')}) {
    margin-left: 8px;
    margin-right: 8px;
    min-width: 60px;

    font-size: 18px;
    line-height: 24px;
    & > input {
      padding: 16px 12px;
    }
  }
`;
const StyledCheckbox = styled(Input)`
  flex: 0;
`;
const ButtonsContainer = styled(Flex)`
  flex: 0;
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
    // {
    //   key: 'order_id',
    //   cellStyle: {
    //     flexBasis: '120px',
    //     minWidth: '120px',
    //     flex: 0,
    //   },
    //   cellTextStyle: {
    //     whiteSpace: 'nowrap',
    //     textOverflow: 'ellipsis',
    //     overflow: 'hidden',
    //   },
    // },
    {
      key: 'name',
      cellStyle: {
        flex: 1,
        flexShrink: 1,
      },
    },
    {
      key: 'item_unit',
      cellStyle: {
        flexBasis: '80px',
        minWidth: '80px',
        justifyContent: 'flex-end',
        flex: 0,
      },
      cellTextStyle: { whiteSpace: 'nowrap' },
      renderer: (data) => {
        return `${data.unit_amount}${unit}`; // 1.5kg
      },
    },
    {
      key: 'unit_quantity',
      cellStyle: {
        flexBasis: '60px',
        minWidth: '60px',
        justifyContent: 'flex-end',
        flex: 0,
      },
      onClick: () => {
        setValue(Number(orderItem.unit_quantity));
      },
      cellTextStyle: {
        whiteSpace: 'nowrap',
        textDecoration: 'underline',
      },
    },
  ];

  const defaultRenderer = (key) => {
    return (d) => String(d[key]);
  };
  return (
    <Wrapper>
      {cellKeys.map((cellKey) => {
        const {
          cellStyle = {},
          cellTextStyle = {},
          ...others
        } = cellKey;
        const key = typeof cellKey === 'string' ? cellKey : get(
          cellKey,
          'key',
        );
        const renderer = typeof cellKey.renderer === 'function' ? cellKey.renderer : defaultRenderer(key);

        const cellLabel = typeof cellKey === 'string'
          ? orderItem[key]
          : renderer(orderItem);
        return (
          <CellContainer key={key} style={cellStyle} {...others}>
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
        <StyledCheckbox
          type="checkbox"
          inputStyle={{
            width: 76,
            height: 76,
          }}
          palette="blue"
        />
      </ButtonsContainer>
    </Wrapper>
  );
};

OrderItemInput.propTypes = {};

OrderItemInput.defaultProps = {};

export default OrderItemInput;
