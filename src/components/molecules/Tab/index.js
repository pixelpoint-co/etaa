import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  palette,
} from 'styled-tools';
import Icon from '../../atoms/Icon';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';
import Button, {
  themeStyle,
  themeColor,
  unsetStyle,
} from '../../atoms/Button';
import Tag from '../../atoms/Tag';

const Container = styled(Flex)`
  padding: 5px 4px;
  flex-direction: row;
  flex: 0;
  background-color: white;
  border-radius: 16px;
`;
const ButtonContainer = styled(Flex)`
  margin: 0px 3px;
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
const Tab = (props) => {
  const {
    options, // { label, value }
    onSelect,
    value,
    themeProps,
    offThemeProps,
    ...others
  } = props;
  return (
    <Container {...others}>
      {options.map((option) => {
        const isSelected = value === option.value;
        console.log(
          value,
          option,
          isSelected,
        );
        const buttonThemeProp = isSelected ? themeProps : offThemeProps;
        return (
          <ButtonContainer
            key={option.value}
          >
            <Button
              {...buttonThemeProp}
              style={{ flex: 1 }}
              themeType={buttonThemeProp.type}
              label={option.label}
              onClick={() => onSelect(option.value)}
            />
          </ButtonContainer>
        );
      })}
    </Container>
  );
};

Tab.propTypes = {
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
  onSelect: PropTypes.func,
};

Tab.defaultProps = {
  themeProps: {
    palette: 'primary',
    tone: 0,
  },
  offThemeProps: {
    palette: 'primary',
    type: 'text',
    tone: 0,
  },
  onSelect: () => {},
};

export default Tab;
