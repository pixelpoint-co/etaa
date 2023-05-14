import React, {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import styled, {
  css,
} from 'styled-components';
import {
  font,
} from 'styled-theme';
import {
  palette, ifProp,
} from 'styled-tools';
import theme from '../../../theme';
import Flex from '../../atoms/Flex';
import ButtonRadio from '../ButtonRadio';
import Text from '../../atoms/P';
import Icon from '../../atoms/Icon';

const borderColor = ({
  disabled,
  invalid,
}) => {
  if (disabled) {
    return palette(
      'grayscale',
      3,
    );
  }
  if (invalid) {
    return palette(
      'red',
      0,
    );
  }
  return palette(
    {
      grayscale: 5,
      primary: 0,
    },
    0,
  );
};

const hoverBorderColor = ({ disabled }) => {
  return disabled ? palette(
    'grayscale',
    0,
  ) : palette(
    'blue',
    0,
  );
};
const checkBorderColor = ({ disabled }) => {
  return disabled ? palette(
    'grayscale',
    0,
  ) : palette(
    'blue',
    0,
  );
};
const IconWrapper = styled(Flex)`
  position: absolute;
  top: 16px;
  left: 16px;
  bottom: 16px;
  right: 16px;
  pointer-events: none;
`;
const StyledIcon = styled(Icon)`
`;
const styles = css`
  font-family: ${font('primary')};
  font-size: 16px;
  width: 100%;
  ${ifProp(
    { type: 'textarea' },
    css`
      height: auto;
    `,
    css`
      min-height: 24px;
    `,
  )};
  ${ifProp(
    { type: 'textarea' },
    css`
      min-height: 24px;
    `,
  )} padding: ${ifProp(
  { type: 'textarea' },
  '8px',
  '0 8px',
)};
  box-sizing: border-box;
  color: ${ifProp(
    'disabled',
    palette(
      'grayscale',
      0,
    ),
    palette(
      'black',
      0,
    ),
  )};
  background-color: ${ifProp(
    'disabled',
    palette(
      'grayscale',
      4,
    ),
    palette(
      'grayscale',
      7,
    ),
  )};
  border: 2px solid ${borderColor};
  border-radius: 16px;
  padding: 16px 20px;
  outline: none;

  &[type='checkbox'],
  &[type='radio'] {
    display: flex;
    flex: initial;
    border: 2px solid ${checkBorderColor};
    background-color: ${ifProp(
    'disabled',
    palette(
      'grayscale',
      0,
    ),
    palette(
      'white',
      0,
    ),
  )};


  }

  &::placeholder {
    color: ${palette(
    'grayscale',
    3,
  )};
  }

  &:focus {
    ${({ invalid }) => (
    !invalid
      ? css`border-color: ${palette(
        'blue',
        0,
      )};`
      : null)
}
  }
  ${ifProp(
    { type: 'number' },
    css`
      ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      ::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    `,
  )}

`;

const Wrapper = styled.label`
  display: flex;
  max-width: 100%;
  flex-direction: column;
  align-items: flex-start;
  vertical-align: middle;
  justify-content: center;
  position: relative;
  margin-bottom: 0px;
  user-select: none;
  & > [type='checkbox'],
  & > [type='radio'] {
    appearance: none;
    cursor: pointer;
    // position: absolute;
    // opacity: 0;

    // icon
    :not(:checked) ~ div {
      opacity: 0;
    }
  }
  & > [type='checkbox'] {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    height: 14px;
    width: 14px;
    &:hover {
      border-color: ${hoverBorderColor};
    }
    ${ifProp(
    { type: 'checkbox' },
    css`
        // checkbox
        & > svg {
          fill: none;
          stroke: none;
        }
      `,
    css`
        // radio
        &::before {
          display: block;
          content: '';
          border-radius: 100%;
          height: 8px;
          width: 8px;
          margin: auto;
        }
      `,
  )};
  }

  /* CHECK STATE */
  /* & > [type='checkbox']:checked ~ .check, */
  & > [type='radio']:checked ~ .check {
    border-color: ${checkBorderColor};
    ${ifProp(
    { type: 'checkbox' },
    css`
        // checkbox
        background-color: ${ifProp(
    'disabled',
    palette(
      'white',
      0,
    ),
    palette(
      'primary',
      3,
    ),
  )};
        & > svg {
          stroke: ${ifProp(
    'disabled',
    palette(
      'grayscale',
      4,
    ),
    palette(
      'white',
      0,
    ),
  )};
        }
      `,
    css`
        // radio
        &::before {
          background-color: ${checkBorderColor};
        }
      `,
  )};
  }
`;

const StyledTextarea = styled.textarea`
  ${styles};
`;
const StyledInput = styled.input`
  ${styles};
`;
const LabelWrapper = styled(Flex)`
  left: 8px;
  margin-bottom: 10px;
  font-family: ${font('primary')};
  font-size: 18px;
  color: ${ifProp(
    'disabled',
    palette(
      'grayscale',
      4,
    ),
    palette(
      'black',
      0,
    ),
  )};
`;
const RequiredText = styled(Text)`
  color: ${palette(
    'primary',
    0,
  )};
  margin-left: 8px;
`;

const Input = ({ ...props }) => {
  const {
    type,
    label,
    required,
    disabled,
    inputStyle,
    palette,
  } = props;
  if (type === 'textarea') {
    return <StyledTextarea {...props} style={inputStyle} />;
  }
  if (type === 'radio' || type === 'checkbox') {
    return (
      <Wrapper {...props}>
        {label ? (
          <LabelWrapper>
            {label}
            {!required && <RequiredText>(선택)</RequiredText>}
          </LabelWrapper>
        ) : null}
        {type === 'checkbox' ? (
          <>
            <StyledInput {...props} style={inputStyle} />
            <IconWrapper>
              <StyledIcon icon="check" size={44} fill={theme.palette.blue[0]} />
            </IconWrapper>
          </>
        ) : null}
        {type !== 'checkbox' && <StyledInput {...props} style={inputStyle} />}
        {type === 'radio' && <span className="check" />}
      </Wrapper>
    );
  }
  if (type === 'buttonSelect') {
    return (
      <Wrapper {...props}>
        {label ? (
          <LabelWrapper>
            {label}
            {!required && <RequiredText>(선택)</RequiredText>}
          </LabelWrapper>
        ) : null}
        <ButtonRadio
          {...props}
          onSelect={(v) => props.setMetaValue(v)}
          selected={props.metaValue}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper {...props}>
      {label ? (
        <LabelWrapper>
          {label}
          {!required && <RequiredText>(선택)</RequiredText>}
        </LabelWrapper>
      ) : null}
      <StyledInput {...props} style={inputStyle} />
    </Wrapper>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  reverse: PropTypes.bool,
  invalid: PropTypes.bool,
  label: PropTypes.string,
  tone: PropTypes.number,
};

Input.defaultProps = { type: 'text' };

export default Input;
export { styles, LabelWrapper, Wrapper as Label, RequiredText };
