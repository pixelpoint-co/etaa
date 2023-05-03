import styled from 'styled-components';
import { palette } from 'styled-theme';

import Flex from '../Flex';

const Card = styled(Flex)`
  border-radius: 15px;
  background-color: ${({ white }) => (white ? palette('white', 0) : palette('grayscale', 6))};
  flex-direction: column;
`;

Card.defaultProps = { white: true };

export default Card;
