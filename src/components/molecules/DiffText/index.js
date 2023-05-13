import PropTypes from 'prop-types';
import styled from 'styled-components';

import round from 'lodash/round';
import hexToRgba from 'hex-to-rgba';

import {
  palette, switchProp,
} from 'styled-tools';

import theme from '../../../theme';

import Flex from '../../atoms/Flex';
import P from '../../atoms/P';

const Container = styled(Flex)`
  align-items: center;
  position: relative;
  flex: 0;
  padding: ${({ filled }) => (filled ? '6px 18px 6px 18px' : '6px 4px')};
  font-size: 22px;
  line-height: 22px;
  font-weight: 500; // medium
  border-radius: 10px;
  background-color: ${({
    value,
    filled,
  }) => (
    // eslint-disable-next-line no-nested-ternary
    !filled
      // eslint-disable-next-line no-nested-ternary
      ? (value === 0
        ? hexToRgba(
          theme.palette.grayscale[0], 0.1,
        )
        : (value > 0
          ? hexToRgba(
            theme.palette.orange[0], 0.1,
          )
          : hexToRgba(
            theme.palette.blue[0], 0.1,
          )
        )
        // eslint-disable-next-line no-nested-ternary
      ) : (value === 0
        ? hexToRgba(
          theme.palette.grayscale[0], 1,
        )
        : (value > 0
          ? hexToRgba(
            theme.palette.orange[0], 1,
          )
          : hexToRgba(
            theme.palette.blue[0], 1,
          )
        )
      )
  )};
`;

const SignContainer = styled(Flex)`
  color: ${({
    filled,
    value,
  }) => (
    // eslint-disable-next-line no-nested-ternary
    filled ? (value === 0 ? 'black' : 'white')
    // eslint-disable-next-line no-nested-ternary
      : (value === 0
        ? hexToRgba(
          theme.palette.grayscale[0], 1,
        )
        : (value > 0 ? palette(
          'orange', 0,
        ) : palette(
          'blue', 0,
        )))
  )};
`;
const Sign = styled(P)`
  color: ${({
    filled,
    value,
  }) => (
  // eslint-disable-next-line no-nested-ternary
    filled ? (value === 0 ? 'black' : 'white')
    // eslint-disable-next-line no-nested-ternary
      : (value === 0
        ? hexToRgba(
          theme.palette.grayscale[0], 1,
        )
        : (value > 0 ? palette(
          'orange', 0,
        ) : palette(
          'blue', 0,
        )))
  )};
`;

const Value = styled(P)`
  white-space: nowrap;
  color: ${({
    filled,
    value,
  }) => (
    // eslint-disable-next-line no-nested-ternary
    filled ? (value === 0 ? 'black' : 'white')
    // eslint-disable-next-line no-nested-ternary
      : (value === 0
        ? hexToRgba(
          theme.palette.grayscale[0], 1,
        )
        : (value > 0 ? palette(
          'orange', 0,
        ) : palette(
          'blue', 0,
        )))
  )};
`;

function numberWithCommas(x) {
  return x.toString().replace(
    /\B(?=(\d{3})+(?!\d))/g, ',',
  );
}

const DiffText = (props) => {
  const {
    value,
    type,
    filled,
    ...otherProps
  } = props;

  const formattedValue = numberWithCommas(Math.abs(round(
    value, 2,
  )));
  const isPositive = value >= 0;
  // eslint-disable-next-line no-nested-ternary
  const sign = value === 0 ? null : (
    // eslint-disable-next-line no-nested-ternary
    (isPositive ? <Sign filled={filled} value={value}>+</Sign> : <Sign filled={filled}>-</Sign>)
  );
  return (
    <Container value={value} filled={filled} {...otherProps}>
      <SignContainer filled={filled}>
        {sign}
      </SignContainer>
      <Value value={value} type={type} filled={filled}>
        {formattedValue}{type === 'percentage' ? '%' : null}
      </Value>
    </Container>
  );
};

DiffText.defaultProps = {
  value: 100,
  type: 'caret',
  filled: true,
};

DiffText.propTypes = {
  value: PropTypes.number,
  type: PropTypes.oneOf([
    'caret',
    'percentage',
  ]),
  filled: PropTypes.bool,
};

export default DiffText;
