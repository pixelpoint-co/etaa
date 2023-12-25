import {
  css,
} from 'styled-components';
import convert from 'color-convert';
import theme from '../../../theme';
// import { palette } from 'styled-tools';

const redRgb = convert.hex.rgb(theme.palette.red[0]);
const redRgba = (op) => `rgba(${[
  ...redRgb,
  op,
].join(', ')})`;
export const pulseStyle = css`
  background: ${redRgba(1)};
  box-shadow: 0 0 0 0 ${redRgba(1)};
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      /* transform: scale(0.95); */
      box-shadow: 0 0 0 0 ${redRgba(0.7)};
    }
    70% {
      /* transform: scale(1); */
      box-shadow: 0 0 0 20px ${redRgba(0)};
    }
    100% {
      /* transform: scale(0.95); */
      box-shadow: 0 0 0 0 ${redRgba(0)};
    }
  }

  &::before {
    content: " ";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    animation: pulse 1.5s infinite;
    animation-delay: 250ms;
  }
`;

export default pulseStyle;
