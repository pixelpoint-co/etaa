import styled, {
  css,
} from 'styled-components';
import {
  palette,
} from 'styled-theme';
import {
  ifProp,
} from 'styled-tools';
import Flex from '../Flex';

import getTheme from '../../../hooks/useTheme';

const errorTheme = getTheme({
  palette: 'red',
  tone: 0,
  type: 'outline',
});

const errorStyle = css`
  border-color: ${errorTheme.foreground};
  background-color: ${errorTheme.hover.background};
`;

const Card = styled(Flex)`
  padding: 20px;
  border-radius: 15px;
  background-color: ${({ tone }) => palette(
    {
      grayscale: tone || 6,
      white: 0,
    },
    0,
  )};
  border-color: ${({ tone }) => palette(
    {
      grayscale: tone || 6,
      white: 0,
    },
    0,
  )};

  border-width: 2px;
  border-style: solid;
  flex-direction: column;
  ${ifProp(
    'hasError',
    errorStyle,
  )}
`;

Card.defaultProps = { palette: 'white' };

export default Card;
