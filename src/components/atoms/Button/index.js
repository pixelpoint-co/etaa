import {
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import styled, {
  ThemeProvider,
  css,
} from 'styled-components';
import {
  Link,
} from 'react-router-dom';
import {
  font,
} from 'styled-theme';
import {
  ifProp,
} from 'styled-tools';
import Spinner from '../Spinner';
import Text from '../P';
import Flex from '../Flex';

import defaultStyle, {
  unsetStyle,
  themeStyle,
  themeSvg,
  themeColor,
} from './style';

import useTheme from '../../../hooks/useTheme';

const pointerEvents = ({
  disabled,
  loading,
}) => {
  if (disabled || loading) {
    return css`
      stroke-dashoffset: 0%;

    `;
  }
  return 'auto';
};

const styles = css`
  ${defaultStyle}
  display: flex;
  text-align: center;
  justify-content: space-between;
  font-family: ${font('secondary')};
  box-sizing: border-box;
  font-size: 20px;
  font-weight: 500;
  line-height: 20px;
  ${ifProp(
    'borderColor',
    css`
    border-color: ${({ borderColor }) => borderColor};
  `,
  )}
  padding: 16px;
  border-radius: 16px;
  align-items: center;
  white-space: nowrap;
  justify-content: center;
  cursor: ${ifProp(
    'disabled',
    'not-allowed',
    'pointer',
  )};
  pointer-events: ${pointerEvents};
  transition: all 250ms ease;

  ${themeStyle}
`;
const Content = styled(Flex)`
  justify-content: row;
  align-items: center;
  position: relative;
`;
const labelStyle = css`
  ${themeColor}
  font-weight: 600;
  font-size: inherit;
  overflow: visible;
  text-align: center;
  white-space: nowrap;
  transition: width 300ms ease-in-out;
  ${({
    $loading,
    hideLabelOnLoading,
  }) => {
    if ($loading && hideLabelOnLoading) {
      return css`
        opacity: 0;
      `;
    }
    if ($loading) {
      return css`
        width: 0px;
      `;
    }
    // if (hideLabelOnLoading) {
    //   return css`
    //     width: auto;
    //   `;
    // }
    return css`
      width: 100%;
    `;
  }};
`;
const StyledText = styled(Text)`
  ${labelStyle}
`;
const StyledLabelNode = styled(Flex)`
  ${labelStyle}
`;

const SpinnerContainer = styled(Flex)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  ${ifProp(
    'hideLabelOnLoading',
    css`
      left: 0;
    `,
  )};
`;

const StyledLink = styled(
  // eslint-disable-next-line no-shadow
  ({
    disabled,
    transparent,
    reverse,
    theme,
    ...props
  }) => <Link {...props} />,
)`
  ${styles};
`;
const Anchor = styled.a`
  ${styles};

`;
const StyledButton = styled.button`
  ${styles};
  position: relative;
`;

const Button = ({
  palette,
  tone,
  themeType,
  type,
  disableClick,
  isAsync,
  onClick,
  loaderStroke,
  loaderSize,
  loading: propsLoading,
  label,
  hideLabelOnLoading,
  children,
  ...props
}) => {
  const { disabled } = props;
  const componentTheme = useTheme({
    palette,
    tone,
    type: themeType, // [solid, outline, text]
  });
  const [
    loading,
    setLoading,
  ] = useState(propsLoading);

  const button = useRef(null);

  if (props.to) {
    return (
      <ThemeProvider theme={(orig) => ({
        ...orig,
        componentTheme,
      })}
      >
        <StyledLink
          {...props}
        >
          {label || children}
        </StyledLink>
      </ThemeProvider>
    );
  }
  if (props.href) {
    return (
      <ThemeProvider theme={(orig) => ({
        ...orig,
        componentTheme,
      })}
      >
        <Anchor
          {...props}
        >
          {label || children}
        </Anchor>
      </ThemeProvider>
    );
  }

  const asyncOnClick = (...args) => {
    setLoading(true);
    if (loading) return null;
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(),
        100,
      );
    })
      .then(() => Promise.resolve(onClick(...args)))
      .then((result) => {
        setTimeout(
          () => {
            setLoading(false);
          },
          100,
        );
        return result;
      })
      .catch((e) => {
        setLoading(false);
        throw e;
      });
  };

  const parsedOnClick = !isAsync ? onClick : asyncOnClick;
  const parsedLoading = propsLoading || loading;

  const handleClick = (e) => {
    if (parsedLoading || disableClick) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    parsedOnClick(e);
  };
  return (
    <ThemeProvider
      theme={(orig) => ({
        ...orig,
        componentTheme,
      })}
    >
      <StyledButton
        {...props}
        ref={button}
        $loading={loading}
        onClick={handleClick}
        type={type}
      >
        {label ? (
          <Content className="button-label-container">
            {typeof label === 'string' ? (
              <StyledText
                disabled={disabled}
                $loading={parsedLoading}
                hideLabelOnLoading={hideLabelOnLoading}
              >
                {label}
              </StyledText>
            ) : (
              <StyledLabelNode
                $loading={parsedLoading}
                hideLabelOnLoading={hideLabelOnLoading}
              >
                {label}
              </StyledLabelNode>
            )}
            {(parsedLoading) ? (
              <SpinnerContainer
                hideLabelOnLoading={hideLabelOnLoading}
              >
                <Spinner
                  {...(loaderStroke ? { fill: loaderStroke } : {})}
                  size={loaderSize || 24}
                />
              </SpinnerContainer>
            ) : null}
          </Content>
        ) : null}
        {children}
      </StyledButton>

    </ThemeProvider>

  );
};

Button.propTypes = {
  disabled: PropTypes.bool,
  type: PropTypes.string,
  to: PropTypes.string,
  href: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  palette: PropTypes.string,
  tone: PropTypes.number,
  themeType: PropTypes.oneOf([
    'solid',
    'outline',
    'text',
    'light',
  ]),
  loading: PropTypes.bool,
  loaderStroke: PropTypes.string,
  hideLabelOnLoading: PropTypes.bool,
};

Button.defaultProps = {
  disabled: false,
  palette: 'primary',
  tone: 0,
  themeType: 'solid',
  to: null,
  href: null,
  type: 'button',
  label: null,
  loading: false,
  loaderStroke: 'white',
  hideLabelOnLoading: false,
  onClick: () => {},
};

export default Button;
export {
  defaultStyle,
  unsetStyle,
  themeStyle,
  themeSvg,
  themeColor,
};
