import PropTypes from 'prop-types';
import styled, {
  css,
} from 'styled-components';
import {
  font, palette,
} from 'styled-theme';
import {
  ifProp, switchProp, prop,
} from 'styled-tools';

const defaultStyle = css`
  font-family: ${(props) => (props.fontFamily ? props.fontFamily : font('primary'))};
  color: ${(props) => (props.color ? props.color : 'auto')};
  margin-top: 0px; /* 0rem */
  margin-bottom: 0px;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-word;
  font-size: 16px;
  font-weight: ${switchProp(
    'weight',
    {
      bold: 700,
      semiBold: 600,
      medium: 500,
      normal: 400,
    },
    400,
  )};
`;

const themeStyle = css`
  color: ${({
    color,
    tone,
  }) => (color || palette(
    { grayscale: tone || 0 },
    0,
  ))};
`;

const P = styled.p`
  ${defaultStyle};
  ${themeStyle};
`;

P.propTypes = {
  reverse: PropTypes.bool,
  palette: PropTypes.string,
};

P.defaultProps = { palette: 'grayscale' };

export default P;
export { defaultStyle };
