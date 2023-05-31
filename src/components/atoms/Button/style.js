import {
  css,
} from 'styled-components';
import {
  ifProp, prop, switchProp,
} from 'styled-tools';

export const unsetStyle = css`
  display: flex;
  position: relative;
  text-decoration: none;
  appearance: none;
  cursor: pointer;
  border: none;
  background: none;
  &:focus {
    outline: none;
  }
`;

const defaultStyle = css`
  ${unsetStyle}
  border-width: 2px;
  border-style: solid;
  ${ifProp(
    'disabled',
    css`opacity: 0.4;`,
  )}
`;

export const themeColor = css`
  color: ${switchProp(
    'theme.componentTheme.type',
    {
      solid: prop('theme.componentTheme.background'),
      outline: prop('theme.componentTheme.foreground'),
      text: prop('theme.componentTheme.foreground'),
    },
  )};
`;

export const themeSvg = css`
  svg {
    fill: ${switchProp(
    'theme.componentTheme.type',
    {
      solid: prop('theme.componentTheme.background'),
      outline: prop('theme.componentTheme.foreground'),
      text: prop('theme.componentTheme.foreground'),
    },
  )};
  }
`;
const themeColorHover = css`
  color: ${switchProp(
    'theme.componentTheme.type',
    {
      solid: prop('theme.componentTheme.hover.background'),
      outline: prop('theme.componentTheme.hover.foreground'),
      text: prop('theme.componentTheme.hover.foreground'),
    },
  )};
`;
const themeSvgHover = css`
  svg {
    fill: ${switchProp(
    'theme.componentTheme.type',
    {
      solid: prop('theme.componentTheme.hover.background'),
      outline: prop('theme.componentTheme.hover.foreground'),
      text: prop('theme.componentTheme.hover.foreground'),
    },
  )};
  }
`;
const themeColorFocus = css`
  color: ${switchProp(
    'theme.componentTheme.type',
    {
      solid: prop('theme.componentTheme.focus.background'),
      outline: prop('theme.componentTheme.focus.foreground'),
      text: prop('theme.componentTheme.focus.foreground'),
    },
  )};
`;
const themeSvgFocus = css`
  svg {
    fill: ${switchProp(
    'theme.componentTheme.type',
    {
      solid: prop('theme.componentTheme.focus.background'),
      outline: prop('theme.componentTheme.focus.foreground'),
      text: prop('theme.componentTheme.focus.foreground'),
    },
  )};
  }
`;

const themeBorder = css`
  border-color: ${switchProp(
    'theme.componentTheme.type',
    {
      solid: prop('theme.componentTheme.foreground'),
      outline: prop('theme.componentTheme.foreground'),
      text: prop('theme.componentTheme.background'),
    },
  )};
`;
const themeBorderHover = css`
  border-color: ${switchProp(
    'theme.componentTheme.type',
    {
      solid: prop('theme.componentTheme.hover.foreground'),
      outline: prop('theme.componentTheme.hover.foreground'),
      text: prop('theme.componentTheme.hover.background'),
    },
  )};
`;
const themeBorderFocus = css`
  border-color: ${switchProp(
    'theme.componentTheme.type',
    {
      solid: prop('theme.componentTheme.focus.foreground'),
      outline: prop('theme.componentTheme.focus.foreground'),
      text: prop('theme.componentTheme.focus.background'),
    },
  )};
`;
const themeBackground = css`
  background-color: ${switchProp(
    'theme.componentTheme.type',
    {
      solid: prop('theme.componentTheme.foreground'),
      outline: prop('theme.componentTheme.background'),
      text: prop('theme.componentTheme.background'),
    },
  )};
`;
const themeBackgroundHover = css`
  background-color: ${switchProp(
    'theme.componentTheme.type',
    {
      solid: prop('theme.componentTheme.hover.foreground'),
      outline: prop('theme.componentTheme.hover.background'),
      text: prop('theme.componentTheme.hover.background'),
    },
  )};
`;
const themeBackgroundFocus = css`
  background-color: ${switchProp(
    'theme.componentTheme.type',
    {
      solid: prop('theme.componentTheme.focus.foreground'),
      outline: prop('theme.componentTheme.focus.background'),
      text: prop('theme.componentTheme.focus.background'),
    },
  )};
`;

const hoverActiveFocus = (props) => {
  const {
    $loading: loading,
    disabled,
  } = props;

  if (disabled || loading) return null;

  return css`
    &:hover {
      ${themeColorHover}
      ${themeSvgHover}
      ${themeBorderHover}
      ${themeBackgroundHover}
    }
    &:active,
    &:focus {
      ${themeColorFocus}
      ${themeSvgFocus}
      ${themeBorderFocus}
      ${themeBackgroundFocus}
    }
  `;
};

export const themeStyle = css`
  ${themeColor}
  ${themeSvg}
  ${themeBorder}
  ${themeBackground}

  ${hoverActiveFocus}
`;

export default defaultStyle;
