import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const StyledImage = styled.img`
  width: ${(props) => (props.width ? `${props.width}px` : props.size ? `${props.size}px` : '100%')};
  height: ${(props) => (props.height ? `${props.height}px` : props.size ? `${props.size}px` : '100%')};
  object-fit: contain;
  border: 0;
  ${(props) => (props.circle
    ? css`
          border-radius: 50%;
          object-position: 50% 0;
        `
    : null)};
  `;

const Image = ({
  width,
  height,
  size,
  circle,
  src,
  ...props
}) => {
  return (
    <StyledImage
      width={width}
      height={height}
      size={size}
      circle={circle}
      src={src}
      {...props}
    />
  );
};

Image.defaultProps = {
  circle: false,
  width: null,
  height: null,
  size: null,
};

Image.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  circle: PropTypes.bool,
  src: PropTypes.string,
};

export default Image;
