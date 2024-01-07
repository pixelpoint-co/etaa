import PropTypes from 'prop-types';
import styled from 'styled-components';
import Flex from '../../atoms/Flex';
import Button from '../../atoms/Button';

const Container = styled(Flex)`
  padding: 5px 4px;
  flex-direction: row;
  flex: 0;
  background-color: white;
  border-radius: 16px;
`;
const ButtonContainer = styled(Flex)`
  margin: 0px 3px;
  justify-content: stretch;
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
        const {
          value: optionValue,
          ...optionRest
        } = option;
        const isSelected = value === optionValue;
        const buttonThemeProp = isSelected ? themeProps : offThemeProps;
        return (
          <ButtonContainer
            key={optionValue}
          >
            <Button
              {...buttonThemeProp}
              style={{ flex: 1 }}
              themeType={buttonThemeProp.type}
              label={option.label}
              onClick={() => onSelect(option.value)}
              {...optionRest}
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
