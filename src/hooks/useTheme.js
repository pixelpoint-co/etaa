import get from 'lodash/get';
import convert from 'color-convert';

import {
  useEffect, useCallback,
} from 'react';

import theme from '../theme';

export default (options = {}) => {
  const {
    palette = 'primary',
    tone = 0,
    baseColor, // hex
    type = 'solid', // [solid, outline, text]
  } = options;
  const parsedBaseColor = baseColor || theme.palette[palette][tone];
  const parsedBaseColorHSL = convert.hex.hsl(parsedBaseColor);
  const solidThemeHSL = {
    foregroundHSL: [
      parsedBaseColorHSL[0],
      parsedBaseColorHSL[1],
      parsedBaseColorHSL[2],
    ],
    backgroundHSL: [ // white
      360,
      100,
      100,
    ],
    hover: {
      foregroundHSL: [
        parsedBaseColorHSL[0],
        parsedBaseColorHSL[1],
        Math.min(
          parsedBaseColorHSL[2] + 20,
          95,
        ),
      ],
      backgroundHSL: [ // white
        360,
        100,
        100,
      ],
    },
    focus: {
      foregroundHSL: [
        parsedBaseColorHSL[0],
        parsedBaseColorHSL[1],
        Math.max(
          parsedBaseColorHSL[2] - 20,
          15,
        ),
      ],
      backgroundHSL: [ // white
        360,
        100,
        100,
      ],
    },
  };
  const solidTheme = {
    foreground: `#${convert.hsl.hex(solidThemeHSL.foregroundHSL)}`,
    background: `#${convert.hsl.hex(solidThemeHSL.backgroundHSL)}`,
    hover: {
      foreground: `#${convert.hsl.hex(solidThemeHSL.hover.foregroundHSL)}`,
      background: `#${convert.hsl.hex(solidThemeHSL.hover.backgroundHSL)}`,
    },
    focus: {
      foreground: `#${convert.hsl.hex(solidThemeHSL.focus.foregroundHSL)}`,
      background: `#${convert.hsl.hex(solidThemeHSL.focus.backgroundHSL)}`,
    },
    type,
    palette,
    tone,
    baseColor,
  };
  const outlineTheme = {
    foreground: solidTheme.foreground,
    background: solidTheme.background,
    hover: {
      foreground: solidTheme.foreground,
      background: `#${convert.hsl.hex([
        parsedBaseColorHSL[0],
        parsedBaseColorHSL[1],
        Math.min(
          parsedBaseColorHSL[2] + 40,
          95,
        ),
      ])}`,
    },
    focus: {
      foreground: solidTheme.foreground,
      background: `#${convert.hsl.hex([
        parsedBaseColorHSL[0],
        parsedBaseColorHSL[1],
        Math.min(
          parsedBaseColorHSL[2] + 40,
          95,
        ),
      ])}`,
    },
    type,
    palette,
    tone,
    baseColor,
  };
  const textTheme = {
    foreground: solidTheme.foreground,
    background: solidTheme.background,
    focus: {
      foreground: outlineTheme.hover.foreground,
      background: outlineTheme.hover.background,
    },
    type,
    palette,
    tone,
    baseColor,
  };
  if (type === 'solid') return solidTheme;
  if (type === 'outline') return outlineTheme;
  if (type === 'text') return textTheme;
  if (type === 'light') return textTheme;
  return solidTheme;
};
