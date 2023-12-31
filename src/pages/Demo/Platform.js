import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  palette, size,
} from 'styled-theme';

import { useMediaQuery } from 'react-responsive';
import Image from '../../components/atoms/Image';
import platformSrc from '../../assets/image/platform.png';
import Card from '../../components/atoms/Card';
import Flex from '../../components/atoms/Flex';

const Container = styled(Flex)`
  flex: 0;
  align-self: shrink;
  background-color: transparent;
  padding-top: 22%;
`;
const Platform = ({}) => {
  const isMobile = useMediaQuery({ query: `(max-width: ${size('mobileBreakpoint')})` });

  return (
    <Container
      transparent
    >
      <Image width={isMobile ? 322 : 644} height="auto" src={platformSrc} />
    </Container>
  );
};

Platform.propTypes = {};

Platform.defaultProps = {};

export default Platform;
