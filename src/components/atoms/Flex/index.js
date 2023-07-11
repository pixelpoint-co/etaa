import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  flex: ${({ flex = 1 }) => flex};
  basis: ${({ basis = 1 }) => `${basis}px`};
  flex-shrink: ${({ shrink = 1 }) => `${shrink}`};
  flex-grow: ${({ grow = 1 }) => `${grow}`};
`;

export default Flex;
