import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  palette,
} from 'styled-tools';
import Modal from '../../atoms/Modal';
import PotControlButton from '../PotControlButton';
import Flex from '../../atoms/Flex';
import Button from '../../atoms/Button';
// import propTypes from '../../../propTypes';

const Container = styled(Flex)`
  flex-direction: column;
  align-items: stretch;
  margin: -5px 0px;
  posi
`;
const OptionContainer = styled(Flex)`
  margin: 5px 0px;
  flex: 0;
`;
const MenuButton = styled(Button)`
  flex: 1;
`;
const MenuSelect = ({
  options, // [{ lable, value }]
  onSelect,
  value,
  buttonTheme = {
    palette: 'grayscale',
    tone: 0,
    themeType: 'solid',
  },
  buttonOffTheme,
  buttonStyle,
  ...others
}) => {
  console.log(
    options,
    value,
  );
  return (
    <Container {...others}>
      {options.map((option) => {
        const selected = option.value === value;
        const optionTheme = selected
          ? buttonTheme
          : {
            ...buttonTheme,
            ...buttonOffTheme,
          };
        return (
          <OptionContainer key={option.value}>
            <MenuButton
              label={option.label}
              palette="grayscale"
              tone={0}
              themeType="solid"
              {...optionTheme}
              onClick={() => onSelect(option.value)}
              style={buttonStyle}
            />
          </OptionContainer>
        );
      })}
    </Container>
  );
};

MenuSelect.propTypes = {
  buttonTheme: PropTypes.shape({
    palette: PropTypes.string,
    tone: PropTypes.number,
    themeType: PropTypes.oneOf([
      'solid',
      'text',
      'outline',
    ]),
  }),
};

MenuSelect.defaultProps = {
  buttonTheme: {
    palette: 'grayscale',
    tone: 0,
    themeType: 'solid',
  },
};

export default MenuSelect;
