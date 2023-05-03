import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { palette } from 'styled-theme';
import { ifProp } from 'styled-tools';

import { ReactComponent as LoaderIcon } from './icons-o/loader.svg';
import { ReactComponent as LogoIcon } from './icons-o/logo.svg';
import { ReactComponent as CaretIcon } from './icons-o/caret.svg';
import { ReactComponent as XIcon } from './icons-o/x.svg';
import { ReactComponent as CheckIcon } from './icons-o/check.svg';

const ReactIcons = {
  loader: LoaderIcon,
  logo: LogoIcon,
  caret: CaretIcon,
  x: XIcon,
  check: CheckIcon,
};

const fillStyle = css`
`;

const fillHover = css`
  ${ifProp(
    'filled',
    ifProp(
      'unfillOnHover',
      null,
      css`
        .filled {
          fill: ${({ hoverPalette }) => palette(hoverPalette, 0)};
          stroke: ${({ hoverPalette }) => palette(hoverPalette, 0)};
        }
      `,
    ),
  )};
`;

const fillOnHover = css`
  ${ifProp(
    'fillOnHover',
    css`
      .filled {
        fill: ${({ hoverPalette }) => palette(hoverPalette, hoverPalette === 'gray' ? 0 : 3)};
        stroke: ${({ hoverPalette }) => palette(hoverPalette, hoverPalette === 'gray' ? 0 : 3)};
      }
      .unfilled {
        fill: none;
        stroke: none;
      }
    `,
  )};
`;

const unfillOnHover = css`
  ${ifProp(
    'unfillOnHover',
    css`
      .filled {
        fill: none;
        stroke: none;
      }
      .unfilled {
        fill: ${({ hoverPalette }) => palette(hoverPalette, hoverPalette === 'gray' ? 0 : 3)};
        stroke: ${({ hoverPalette }) => palette(hoverPalette, hoverPalette === 'gray' ? 0 : 3)};
      }
    `,
  )};
`;

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
  color: ${ifProp(
    'palette',
    ifProp({ palette: 'white' }, palette({ gray: 0 }, 0), palette({ blue: 0 }, 0)),
    'currentcolor',
    'white',
  )};

  height: ${({
    size,
    height,
  }) => `${size || height}px`};
  width: ${({
    size,
    width,
  }) => `${size || width}px`};
  ${ifProp(
    'fill',
    css`
      width: 100%;
      height: 100%;
    `,
  )}

  & > svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    fill: ${(props) => (props.fill ? props.fill : '')};
    stroke: ${(props) => (props.stroke ? props.stroke : '')};
  }

  ${ifProp(
    'hoverPalette',
    css`
      &:hover > svg {
        fill: ${({ hoverPalette }) => palette(hoverPalette, hoverPalette === 'gray' ? 0 : 3)};
        stroke: ${({ hoverPalette }) => palette(hoverPalette, hoverPalette === 'gray' ? 0 : 3)};
        ${unfillOnHover};
        ${fillOnHover};
        ${fillHover};
      }
    `,
  )};
`;

const Icon = ({
  icon,
  ...props
}) => {
  const ReactIcon = ReactIcons[icon];
  return <Wrapper {...props} className="icon">{ReactIcon && <ReactIcon />}</Wrapper>;
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  size: PropTypes.number,
  hoverPalette: PropTypes.string,
  palette: PropTypes.string,
};

Icon.defaultProps = {
  height: 24,
  width: 24,
  size: null,
  hoverPalette: 'gray',
  palette: 'gray',
};

export default Icon;
