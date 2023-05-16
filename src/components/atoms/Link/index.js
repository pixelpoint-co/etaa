import PropTypes from 'prop-types';
import styled, {
  css,
} from 'styled-components';
import {
  font, palette,
} from 'styled-theme';
import {
  ifProp,
} from 'styled-tools';
import {
  NavLink,
} from 'react-router-dom';

const styles = css`
  ${ifProp(
    'fill',
    `
      display: flex;
      flex: 1;
    `,
    '',
  )}
  font-family: ${font('primary')};
  text-decoration: none;
  color: ${ifProp(
    { disabled: true },
    palette(
      'grayscale',
      4,
    ),
    palette(3),
  )};
  transition: all 0.1s ease;
  cursor: ${ifProp(
    { disabled: true },
    'no-drop',
  )};
  pointer-events: ${ifProp(
    { disabled: true },
    'none',
  )};

  &:hover,
  &:focus {
    text-decoration: ${ifProp(
    'disabled',
    'none',
    ifProp(
      'disabledStyle',
      'none',
    ),
    'underline',
  )};
  }
`;

const StyledNavLink = styled(({
  theme,
  reverse,
  // palette,
  ...props
}) => <NavLink {...props} />)`
  ${styles};
`;

const Anchor = styled.a`
  ${styles};
`;

const Link = (props) => {
  const {
    fill,
    disableStyle,
    ...others
  } = props;
  if (props.to) {
    return <StyledNavLink {...props} fill={fill} />;
  }
  return <Anchor {...others} />;
};

Link.propTypes = {
  disabled: PropTypes.bool,
  disableStyle: PropTypes.bool,
  palette: PropTypes.string,
  reverse: PropTypes.bool,
  to: PropTypes.string,
  fill: PropTypes.bool,
};

Link.defaultProps = {
  palette: 'white',
  disabled: false,
  disableStyle: true,
  reverse: false,
  to: '/',
  fill: false,
};

export default Link;
