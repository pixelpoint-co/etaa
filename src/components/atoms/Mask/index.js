import PropTypes from 'prop-types';
import styled from 'styled-components';
import Flex from '../Flex';

const Background = styled(Flex)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  justify-content: center;
  align-items: center;
`;

const Mask = (props) => {
  const {
    visible,
    ...others
  } = props;

  if (!visible) return null;

  return (
    <Background {...others} />
  );
};

Mask.defaultProps = { visible: false };

Mask.propTypes = { visible: PropTypes.bool };

export default Mask;
