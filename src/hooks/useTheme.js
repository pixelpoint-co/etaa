import get from 'lodash/get';
import convert from 'color-convert';
import rgbHex from 'rgb-hex';

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
  console.log(
    'parsedBaseColor: ',
    parsedBaseColor,
  );
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
          90,
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
    disabled: {
      foreground: theme.palette.grayscale[3],
      background: theme.palette.white[0],
    },
    type,
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
          90,
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
          90,
        ),
      ])}`,
    },
    disabled: {
      foreground: theme.palette.grayscale[3],
      background: theme.palette.white[0],
    },
    type,

  };
  console.log(solidTheme);
  if (type === 'solid') return solidTheme;
  if (type === 'outline') return outlineTheme;
  return solidTheme;
};
