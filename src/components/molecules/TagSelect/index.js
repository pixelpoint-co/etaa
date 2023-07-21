import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  palette,
} from 'styled-tools';
import Icon from '../../atoms/Icon';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';
import {
  themeStyle, themeColor,
} from '../../atoms/Button';
import Tag from '../../atoms/Tag';

const Container = styled(Flex)`
  flex-direction: column;
  flex: 0;
  font-size: 22px;
  line-height: 22px;
  padding: 14px 20px;
  border-radius: 15px;
  align-items: flex-start;
  ${themeStyle}
`;
const Label = styled(Text)`
  font-size: 20px;
  line-height: 20px;
  color: ${palette(
    'grayscale',
    2,
  )};
`;
const TagListContainer = styled(Flex)`
  flex-wrap: wrap;
  margin: -5px -10px;
  margin-top: ${(12 - 5)}px;
`;
const TagContainer = styled(Flex)`
  margin: 5px 10px;
  flex: 0;
`;
const ignoreIndex = (list, index) => list.filter((v, i) => i !== index);
const TagSelect = (props) => {
  const {
    options, // { label, value }
    isMulti,
    label,
    value,
    onSelect,
    themeProps,
    offThemeProps,
    ...others
  } = props;
  const valueList = isMulti ? (value || []) : [value];
  const handleSelect = (v) => {
    const selectedIndex = valueList.indexOf(v);
    const isSelected = selectedIndex > -1;

    const newValueList = isSelected ? ignoreIndex(
      valueList,
      selectedIndex,
    ) : [
      v,
      ...valueList,
    ];

    return onSelect(isMulti ? newValueList : newValueList[0]);
  };
  return (
    <Container {...others}>
      <Label>
        {label}
      </Label>
      <TagListContainer>
        {options.map((v) => {
          const selectedIndex = valueList.indexOf(v.value);
          const isSelected = selectedIndex > -1;
          const tagThemeProps = isSelected ? themeProps : offThemeProps;
          return (
            <TagContainer
              key={v.value}
            >
              <Tag
                {...others}
                label={v.label}
                value={v.value}
                themeProps={tagThemeProps}
                onClick={(e) => {
                  handleSelect(v.value);
                }}
              />
            </TagContainer>
          );
        })}
      </TagListContainer>
    </Container>
  );
};

TagSelect.propTypes = {
  themeProps: PropTypes.shape({
    palette: PropTypes.string,
    tone: PropTypes.number,
    type: PropTypes.oneOf([
      'solid',
      'outline',
      'text',
    ]),
  }),
  offThemeProps: PropTypes.shape({
    palette: PropTypes.string,
    tone: PropTypes.number,
    type: PropTypes.oneOf([
      'solid',
      'outline',
      'text',
    ]),
  }),
};

TagSelect.defaultProps = {
  themeProps: {
    palette: 'primary',
    tone: 0,
  },
  offThemeProps: {
    palette: 'grayscale',
    tone: 3,
  },
};

export default TagSelect;
