import styled from 'styled-components';
import { palette } from 'styled-theme';

import Flex from '../Flex';

const Card = styled(Flex)`
  border-radius: 15px;
  background-color: ${palette({
    grayscale: 6,
    white: 0,
  }, 0)};
  flex-direction: column;
`;

Card.defaultProps = { palette: 'white' };

export default Card;
