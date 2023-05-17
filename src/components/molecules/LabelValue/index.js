import styled from 'styled-components';
import {
  palette,
} from 'styled-theme';
import {
  ifProp, switchProp, prop,
} from 'styled-tools';

import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';

const Wrapper = styled(Flex)`
  flex-direction: row;
  flex: 1;
  padding: 10px;
`;

const Label = styled(Text)`
  flex: 1;
  font-size: 22px;
  align-self: flex-start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${palette(
    'grayscale',
    0,
  )};
  font-weight: ${ifProp(
    'bold',
    800,
    400,
  )};
`;

const Value = styled(Text)`
  font-size: 22px;
  align-self: flex-end;
  color: ${palette(
    'black',
    0,
  )};
  font-weight: ${ifProp(
    'bold',
    800,
    400,
  )};
`;
const LabelValue = ({
  label,
  value,
  labelStyle,
  valueStyle,
  bold,
  ...others
}) => {
  return (
    <Wrapper
      {...others}
    >
      <Label
        style={labelStyle}
        bold={bold}
      >
        {label}
      </Label>
      <Value
        style={valueStyle}
        bold={bold}
      >
        {value}
      </Value>
    </Wrapper>
  );
};

export default LabelValue;
