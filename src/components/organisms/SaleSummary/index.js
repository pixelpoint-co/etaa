import React from 'react';
import PropTypes from 'prop-types';
import styled, {
  css,
} from 'styled-components';
import {
  palette, size,
} from 'styled-theme';

import Card from '../../atoms/Card';
import Heading from '../../atoms/Heading';
import Text from '../../atoms/P';
import Divider from '../../atoms/Divider';
import Flex from '../../atoms/Flex';

import DiffText from '../../molecules/DiffText';
import {
  formatCurrency,
} from '../../../services/number';

const Wrapper = styled(Card)`
  padding: 20px 20px 10px 20px;
`;

const Title = styled(Text)`
  white-space: nowrap;
  font-size: 22px;
  line-height: 22px;
  color: ${palette(
    'grayscale',
    2,
  )};
`;
const Value = styled(Text)`
  white-space: nowrap;
  font-weight: bold;
  font-size: 30px;
  font-weight: 600;
  line-height: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const DiffValue = styled(Value)`
  margin-left: 16px;
  font-size: 22px;
  font-weight: 500;
`;

const DiffContainer = styled(Flex)`
  flex-direction: row;
  align-items: center;

`;
const DiffTitle = styled(Text)`
  white-space: nowrap;
  font-size: 14px;
  color: ${palette(
    'grayscale',
    2,
  )};
`;

const StyledDiffText = styled(DiffText)`
  margin-left: auto;
`;

const SaleSummary = (props) => {
  const {
    title,
    value,
    diffTitle,
    diffValue,
    formatValue,
    ...others
  } = props;
  return (
    <Wrapper
      palette="white"
    >
      <Title level={2}>{title}</Title>
      <Value>{formatValue(value)}</Value>
      <Divider verticalMargin={10} />
      <DiffContainer>
        <DiffTitle>{diffTitle}</DiffTitle>
        <DiffValue>{formatValue(diffValue)}</DiffValue>
        <StyledDiffText
          value={((value - diffValue) / value) * 100}
          filled={false}
          type="percentage"
        />
      </DiffContainer>
    </Wrapper>
  );
};

SaleSummary.defaultProps = {
  title: 'title',
  value: 200,
  diffTitle: '1',
  diffValue: 2,
  formatValue: formatCurrency,
};

SaleSummary.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  diffTitle: PropTypes.string,
  diffValue: PropTypes.string,
  formatValue: PropTypes.func,
};

export default SaleSummary;
