import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { palette } from 'styled-theme';

import Image from '../../components/atoms/Image';
import platformSrc from '../../assets/image/platform.png';
import Card from '../../components/atoms/Card';
import Flex from '../../components/atoms/Flex';

const Container = styled(Flex)`
  flex: 0;
  align-self: shrink;
  background-color: transparent;
  padding-top: 136px;
`;
const Platform = ({}) => {
  return (
    <Container
      transparent
    >
      <Image width={644} height="auto" src={platformSrc} />
    </Container>
  );
};

Platform.propTypes = {
  title: PropTypes.string,
  hourly: PropTypes.number,
  type: PropTypes.string,
  beforeTax: PropTypes.number,
  afterTax: PropTypes.number,
  date: PropTypes.string, // ISO string
};

Platform.defaultProps = {
  title: 'title',
  hourly: 10000,
  type: 'monthly',
  beforeTax: 321000,
  afterTax: 321000,
  date: moment().toISOString(),
};

export default Platform;
