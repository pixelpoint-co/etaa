import {
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
  palette,
  ifProp,
  ifNotProp,
  switchProp,
  prop,
} from 'styled-tools';
import Spinner from '../Spinner';
import Text from '../P';
import Flex from '../Flex';

import defaultStyle, {
  unsetStyle,
} from './style';

import useTheme from '../../../hooks/useTheme';

const themeColor = css`
  color: ${ifProp(
    'disabled',
    switchProp(
      'theme.type',
      {
        solid: prop('theme.disabled.background'),
        outline: prop('theme.disabled.foreground'),
        text: prop('theme.disabled.foreground'),
      },
    ),
    switchProp(
      'theme.type',
      {
        solid: prop('theme.background'),
        outline: prop('theme.foreground'),
        text: prop('theme.foreground'),
      },
    ),
  )};
`;
const themeColorHover = css`
  color: ${switchProp(
    'theme.type',
    {
      solid: prop('theme.hover.background'),
      outline: prop('theme.hover.foreground'),
      text: prop('theme.hover.foreground'),
    },
  )};
`;
const themeColorFocus = css`
  color: ${switchProp(
    'theme.type',
    {
      solid: prop('theme.focus.background'),
      outline: prop('theme.focus.foreground'),
      text: prop('theme.focus.foreground'),
    },
  )};
`;

const themeBorder = css`
  border-color: ${ifProp(
    'disabled',
    switchProp(
      'theme.type',
      {
        solid: prop('theme.disabled.foreground'),
        outline: prop('theme.disabled.foreground'),
        text: prop('theme.disabled.background'),
      },
    ),
    switchProp(
      'theme.type',
      {
        solid: prop('theme.foreground'),
        outline: prop('theme.foreground'),
        text: prop('theme.background'),
      },
    ),
  )};
`;
const themeBorderHover = css`
  border-color: ${switchProp(
    'theme.type',
    {
      solid: prop('theme.hover.foreground'),
      outline: prop('theme.hover.foreground'),
      text: prop('theme.hover.background'),
    },
  )};
`;
const themeBorderFocus = css`
  border-color: ${switchProp(
    'theme.type',
    {
      solid: prop('theme.focus.foreground'),
      outline: prop('theme.focus.foreground'),
      text: prop('theme.focus.background'),
    },
  )};
`;
const themeBackground = css`
  background-color: ${ifProp(
    'disabled',
    switchProp(
      'theme.type',
      {
        solid: prop('theme.disabled.foreground'),
        outline: prop('theme.disabled.background'),
        text: prop('theme.disabled.background'),
      },
    ),
    switchProp(
      'theme.type',
      {
        solid: prop('theme.foreground'),
        outline: prop('theme.background'),
        text: prop('theme.background'),
      },
    ),
  )};
`;
const themeBackgroundHover = css`
  background-color: ${switchProp(
    'theme.type',
    {
      solid: prop('theme.hover.foreground'),
      outline: prop('theme.hover.background'),
      text: prop('theme.hover.background'),
    },
  )};
`;
const themeBackgroundFocus = css`
  background-color: ${switchProp(
    'theme.type',
    {
      solid: prop('theme.focus.foreground'),
      outline: prop('theme.focus.background'),
      text: prop('theme.focus.background'),
    },
  )};
`;

const themeStyle = css`
  ${themeColor}
  ${themeBorder}
  ${themeBackground}

  &:hover {
    ${themeColorHover}
    ${themeBorderHover}
    ${themeBackgroundHover}
  }
  &:active,
  &:focus {
    ${themeColorFocus}
    ${themeBorderFocus}
    ${themeBackgroundFocus}
  }
`;

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
  pointer-events: ${ifProp(
    'disabled',
    'none',
    'auto',
  )};
  transition: all 250ms ease;

  ${themeStyle}
`;
const Content = styled(Flex)`
  justify-content: row;
  align-items: center;
  position: relative;
`;
const loadingTextStyle = css`

`;
const StyledText = styled(Text)`
  ${themeColor}
  font-weight: 500;
  font-size: inherit;
  overflow: visible;
  text-align: center;
  white-space: nowrap;
  transition: width 300ms ease-in-out;
  ${({
    loading,
    hideLabelOnLoading,
  }) => {
    if (loading && hideLabelOnLoading) {
      return css`
        opacity: 0;
      `;
    }
    if (loading) {
      return css`
        width: 0px;
      `;
    }
    if (hideLabelOnLoading) {
      return css`
        width: auto;
      `;
    }
    return css`
      width: 100%;
    `;
  }};
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
`;

const Button = ({
  palette,
  tone,
  themeType,
  type,
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
  const theme = useTheme({
    palette,
    tone,
    type: themeType, // [solid, outline, text]
  });

  const [
    loading,
    setLoading,
  ] = useState(propsLoading);

  if (props.to) {
    return (
      <ThemeProvider theme={theme}>
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
      <ThemeProvider theme={theme}>
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

  return (
    <ThemeProvider theme={theme}>
      <StyledButton
        {...props}
        onClick={parsedOnClick}
        type={type}
      >
        {label ? (
          <Content>
            <StyledText
              loading={parsedLoading}
              hideLabelOnLoading={hideLabelOnLoading}
            >
              {label}
            </StyledText>
            {(parsedLoading) ? (
              <SpinnerContainer
                hideLabelOnLoading={hideLabelOnLoading}
              >
                <Spinner
                  {...(loaderStroke ? {
                    fill: loaderStroke,
                    size: loaderSize || 24,
                  } : {})}
                />
              </SpinnerContainer>
            ) : null}
          </Content>
        ) : children}
      </StyledButton>
    </ThemeProvider>

  );
};

Button.propTypes = {
  disabled: PropTypes.bool,
  type: PropTypes.string,
  to: PropTypes.string,
  href: PropTypes.string,
  label: PropTypes.string,
  palette: PropTypes.string,
  tone: PropTypes.number,
  themeType: PropTypes.oneOf([
    'solid',
    'outline',
    'text',
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
};

export default Button;
export {
  defaultStyle,
  unsetStyle,
};
