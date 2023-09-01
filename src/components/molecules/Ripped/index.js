import PropTypes from 'prop-types';
import styled, {
  css,
} from 'styled-components';
import {
  palette,
} from 'styled-theme';
import {
  ifProp,
} from 'styled-tools';
import Flex from '../../atoms/Flex';
import { errorStyle as CardErrorStyle } from '../../atoms/Card';
import paperCut from '../../atoms/Icon/icons-o/paper-cut.svg';

const errorStyle = css`
  ${CardErrorStyle};
`;

const styles = css`
  ${ifProp(
    'hasError',
    errorStyle,
  )}
`;

export const RipContainerTop = styled.div`
  /* transform: rotate(180deg); */
  transform: rotateX(180deg);
  height: 18px;
  background-image: url(${paperCut});
  background-size: 50px 18px;
  background-position: 25px;
  background-repeat: repeat;
  overflow: hidden;
`;
export const RipContainerBottom = styled.div`
  height: 18px;
  background-image: url(${paperCut});
  background-size: 50px 18px;
  background-repeat: repeat;
`;

const Container = styled(Flex)`
  ${styles};
  position: relative;
  overflow: visible;
  ${ifProp(
    '$ripTop',
    css`
      margin-top: 0px;
    `,
  )}
  ${ifProp(
    '$ripBottom',
    css`
      margin-bottom: -18px;
    `,
  )}
  background: transparent;
  flex-direction: column;
`;
const Body = styled(Flex)`
  background-color: white;
  align-self: stretch;
  flex-direction: column;
`;

const Ripped = ({
  ripTop = true,
  ripBottom = true,
  children,
  ...others
}) => (
  <Container
    $ripTop={ripTop}
    $ripBottom={ripBottom}
  >
    {ripTop ? (
      <RipContainerTop />
    ) : null}
    <Body
      children={children}
      {...others}
    />
    {ripBottom ? (
      <RipContainerBottom />
    ) : null}
  </Container>
);

Ripped.propTypes = {
  ripTop: PropTypes.bool,
  ripBottom: PropTypes.bool,
};

Ripped.defaultProps = {
  palette: 'white',
  ripTop: true,
  ripBottom: true,
};

export default Ripped;
