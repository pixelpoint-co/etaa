import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactSelect, {
  createFilter,
} from 'react-select';
import get from 'lodash/get';
import {
  FixedSizeList as List,
} from 'react-window';
import customStyle from './styles';
// import DataView from '../../molecules/DataView';
import Card from '../Card';

const MenuContainer = styled.div`
  > div {
    > div {
      div {
        div {
          height: 100%;
          display: flex;
          align-items: center;
        }
      }
    }
  }
`;

const MenuList = (props) => {
  const {
    options,
    children,
    maxHeight,
    getValue,
  } = props;
  const height = 35;
  const [value] = getValue();
  const listHeight = Math.min(
    maxHeight,
    height * children.length,
  ) || 200;
  let initialOffset = options.indexOf(value) * height;
  initialOffset = initialOffset > listHeight ? initialOffset : 0;
  return (
    <MenuContainer>
      { children.length ? (
        <List
          height={listHeight}
          itemCount={children.length}
          itemSize={height}
          initialScrollOffset={initialOffset}
        >
          {({
            index,
            style,
          }) => <div style={style}>{children[index]}</div>}
        </List>
      ) : <div style={{ padding: '10px 8px' }}> No options available </div>}
    </MenuContainer>
  );
};

const Select = ({
  options,
  value,
  onChange,
  type,
  invalid,
  isClearable,
  preview = [],
  initialValue,
  disabled,
  ...others
}) => {
  const selectedOption = options.filter((option) => option.value === value);
  const initialOption = options.filter((option) => option.value === initialValue);
  // .map((v) => pick(v, ['label', 'value']));
  const defaultValue = (selectedOption.length > 0 ? selectedOption : initialOption);
  return (
    <ReactSelect
      className="select"
      autoBlur
      components={{ MenuList }}
      filterOption={createFilter({ ignoreAccents: false })}
      options={options}
      onChange={(sValue) => {
        onChange(get(
          sValue,
          'value',
          null,
        ));
      }}
      closeMenuOnSelect
      isClearable={isClearable}
      onBlurResetsInput={false}
      onCloseResetsInput={false}
      hideSelectedOptions={false}
      // styles={customStyle({
      //   invalid,
      //   disabled,
      // })}
      value={selectedOption}
      defaultValue={defaultValue}
      isDisabled={disabled}
      menuPlacement="auto"
      {...others}
    />
  );
};

Select.propTypes = {
  options: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  invalid: PropTypes.bool,
  isClearable: PropTypes.bool,
  onChange: PropTypes.func,
  preview: PropTypes.arrayOf(PropTypes.string),
};

export default Select;
