import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  palette, size,
} from 'styled-theme';
import {
  useState,
} from 'react';
import IconButton from '../../molecules/IconButton';
import Input from '../../molecules/Input';
import Flex from '../../atoms/Flex';
import Button from '../../atoms/Button';

const SearchBarWrapper = styled(Flex)`
  align-items: center;
  position: relative;
`;

const StyledInput = styled(Input)`
  & div[role=alert] {
    position: absolute;
    top: 100%;
  }
  border-color: ${palette(
    'grayscale',
    4,
  )};
  flex: 1;
`;
const Submit = styled(Button)`
  position: absolute;
  right: 5px;
  top: 5px;
  bottom: 5px;
`;

// const CloseButton = styled.div`
//   cursor: pointer;
//   padding: ${size('padding')};
//   box-shadow: none;
//   font-size: 12px;
//   color: ${palette(
//     'primary',
//     0,
//   )};
//   height: 38px;
//   display: flex;
//   align-items: center;

//   @media (max-width: 768px){
//     font-size: 14px;
//     padding-top: 2px;
//   }
// `;

const StyledIconButton = styled(IconButton)`
  border: none;
  box-shadow: none;
  min-width: 50px;
  color: ${palette(
    'primary',
    0,
  )};
  margin-bottom: 0px;

  @media (max-width: 768px){
    min-width: 30px;
  }
`;

const StyledForm = styled.form`
  /* @media (max-width: ${size('mobileBreakpoint')}){
    width: 100%;
    margin-bottom: 10px;
  } */
  border: 1px solid ${palette(
    'primary',
    0,
  )};
  /* border-radius: 4px 4px 4px 4px; */
`;

const SearchBar = ({
  placeholder,
  onChange,
  onSubmit,
  onReset,
  initialValue,
  label,
  loading,
  ...others
}) => {
  const [
    value,
    setValue,
  ] = useState(initialValue || '');
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // 👇 Get input value
      onSubmit(value);
    }
  };
  return (
    <SearchBarWrapper {...others}>
      <StyledInput
        type="text"
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        value={value}
      />
      <Submit
        transparent
        label="검색"
        iconStroke="white"
        hideLabelOnLoading
        onClick={() => onSubmit(value)}
      />
    </SearchBarWrapper>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSubmit: PropTypes.func,
  onReset: PropTypes.func,
  label: PropTypes.string,
  loading: PropTypes.bool,
};

SearchBar.defaultProps = {
  placeholder: 'Search Keywords',
  label: '검색',
  label: '검색',
};

export default SearchBar;
