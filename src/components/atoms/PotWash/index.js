import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '../Icon';
import Flex from '../Flex';

import potImageSrc from '../../../assets/image/pot.png';
import dropImageSrc from '../../../assets/image/water-drop.png';
import Image from '../Image';

const Container = styled(Flex)`
  position: relative;
`;
const DropImage = styled(Image)`
  position: absolute;
  top: 50%;
  left: 100%;
  width: 35%;
  max-width: 30px;
  transform: translateX(-80%);
  height: auto;
`;
const PotWash = (props) => {
  const {
    size,
    ...others
  } = props;

  return (
    <Container
      {...others}
    >
      <Image src={potImageSrc} size={size} />
      <DropImage src={dropImageSrc} size={size * 0.5} />
    </Container>
  );
};

PotWash.propTypes = {
  affix: PropTypes.string,
  value: PropTypes.string,
};

PotWash.defaultProps = {
  affix: '',
  value: '',
};

export default PotWash;
