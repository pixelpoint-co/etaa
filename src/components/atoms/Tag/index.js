import PropTypes from 'prop-types';
import styled, {
  ThemeProvider,
} from 'styled-components';
import {
  palette,
} from 'styled-tools';
import Icon from '../Icon';
import Flex from '../Flex';
import Text from '../P';
import {
  themeStyle, themeColor,
  defaultStyle,
} from '../Button';
import useTheme from '../../../hooks/useTheme';

const Container = styled(Flex)`
  ${defaultStyle}
  ${themeStyle}
  ${themeColor}

  display: inline-flex;
  flex: 0;
  font-size: 22px;
  line-height: 22px;
  padding: 14px 20px;
  border-radius: 15px;
  align-items: center;
  padding: 10px 20px;
`;
const Label = styled(Text)`
  ${themeColor}
  white-space: nowrap;
  font-size: 22px;
  line-height: 22px;
`;
const StyledIcon = styled(Icon)`
  margin-right: 12px;
`;

const Tag = (props) => {
  const {
    label,
    value,
    themeProps,
    ...others
  } = props;
  const componentTheme = useTheme(themeProps);
  return (
    <ThemeProvider
      theme={(orig) => ({
        ...orig,
        componentTheme,
      })}
    >
      <Container {...others}>
        <StyledIcon
          icon="check"
          size={13}
        />
        <Label {...others}>
          {label}
        </Label>
      </Container>
    </ThemeProvider>
  );
};

Tag.propTypes = { palette: PropTypes.string };

Tag.defaultProps = { palette: 'primary' };

export default Tag;
