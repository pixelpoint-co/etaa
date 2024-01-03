import PropTypes from 'prop-types';
import {
  useNavigate, useParams, useHistory,
} from 'react-router-dom';

import styled from 'styled-components';
import {
  palette,
} from 'styled-tools';
import Icon from '../../atoms/Icon';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';
import Link from '../../atoms/Link';
import PotUnit from '../PotUnit';
import Button, {
  themeStyle,
  themeColor,
  unsetStyle,
} from '../../atoms/Button';
import Tag from '../../atoms/Tag';

const Container = styled(Flex)`
  // padding: 5px 4px;
  // flex-direction: row;
  // flex: 0;
  // background-color: white;
  border-radius: 16px;
  margin: 10px 0px;
  // flex-wrap: wrap;
  flex: 0;
  // flex-basis: 640px;
  background-color: ${palette(
    'grayscale',
    6,
  )};

  zoom: 0.5;
  -webkit-text-size-adjust: none;
`;
const ButtonContainer = styled(Flex)`
  margin: 0px 3px;
`;
const PotCardContainer = styled(Link)`
  display: flex;
  flex: 1;
  margin: 10px;
  flex-basis: 45%;
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
const PotTab = (props) => {
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
      {options.map((option, i) => {
        const isSelected = Number(value) === option.value;
        console.log(
          value,
          option,
          isSelected,
        );
        const tabThemeProp = isSelected ? themeProps : offThemeProps;
        return (
          <PotCardContainer
            key={option.value}
          >
            <PotUnit
              {...tabThemeProp}
              style={{ flex: 1 }}
              themeType={tabThemeProp.type}
              cookerId={i}
              onClick={() => onSelect((prev) => ({
                ...prev,
                selectedCookerId: option.value,
              }))}
            />
          </PotCardContainer>
        );
      })}
    </Container>
  );
};

PotTab.propTypes = {
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

PotTab.defaultProps = {
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

export default PotTab;
