import {
  PlusOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import {
  Button,
  Input, Select as AntdSelect, Space,
} from 'antd';
import {
  useRef, useState,
} from 'react';
import styled from 'styled-components';
import {
  styles,
  Label,
  LabelWrapper,
  RequiredText,
} from '../Input';
import Divider from '../../atoms/Divider';

const StyledAntdSelect = styled(AntdSelect)`
  &.ant-select {
    flex: 1;
    height: 100%;
    width: 100%;
  }
  &.ant-select .ant-select-selector {
    ${styles};
    height: 100%;
    .ant-select-selection-search {
      display: flex;
      align-items: center;
    }
  }
`;

const Select = (props) => {
  const {
    onChange,
    allowAddItem,
    value: selectedValue,
    onAddItem,
    items,
    label,
    required,
    ...others
  } = props;
  console.log(props);
  const [
    newItem,
    setNewItem,
  ] = useState('');

  const inputRef = useRef(null);

  const setNewItemFn = (e) => {
    e.preventDefault();
    setNewItem(e.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    onAddItem(newItem);
    setTimeout(
      () => {
        inputRef.current?.focus();
      },
      0,
    );
  };
  const parsedItems = items.map((item) => {
    if (typeof item === 'string' || typeof item !== 'object') {
      return {
        label: item,
        value: item,
      };
    }
    return item;
  });
  console.log(others);
  return (
    <Label style={{ flex: 1 }}>
      {label ? (
        <LabelWrapper>
          {label}
          {!required && <RequiredText>(선택)</RequiredText>}
        </LabelWrapper>
      ) : null}
      <StyledAntdSelect
        {...others}
        mode="single"
        dropdownMatchSelectWidth={false}
        showSearch
        value={selectedValue}
        onChange={onChange}
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        options={parsedItems}
        {...(allowAddItem ? {
          dropdownRender: (menu) => (
            <>
              {menu}
              <Divider
                verticalMargin={8}
              />
              <Space
                style={{ padding: '0 8px 4px' }}
              >
                <Input
                  ref={inputRef}
                  placeholder="추가"
                  value={newItem}
                  onChange={setNewItemFn}
                />
                <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                  Add item
                </Button>
              </Space>
            </>
          ),
        } : {})}
      />
    </Label>

  );
};

Select.propTypes = {
  items: PropTypes.arrayOf(PropTypes.oneOf([
    PropTypes.string,
    PropTypes.shape({
      label: PropTypes.string,
      // eslint-disable-next-line react/forbid-prop-types
      value: PropTypes.any,
    }),
  ])),
  onAddItem: PropTypes.func,
  allowAddItem: PropTypes.bool,
};

Select.defaultProps = {
  items: [
    'sdf',
    'ddd',
  ],
  onAddItem: (v) => console.log(
    '[Select] onAddItem() ',
    v,
  ),
  allowAddItem: false,
};

export default Select;
