import { css } from 'styled-components';

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
`;

export default defaultStyle;
