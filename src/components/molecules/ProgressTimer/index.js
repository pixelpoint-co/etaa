import {
  useEffect,
  useState,
} from 'react';
import moment from 'moment';
import styled, {
  css,
} from 'styled-components';
import {
  font, palette,
} from 'styled-theme';
import {
  ifProp,
} from 'styled-tools';
import dayjs from 'dayjs';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';
import ProgressBar from '../ProgressBar';
import useCountdown from '../../../hooks/useCountdown';

const Container = styled(Flex)`
  flex-direction: column;
`;
const TimerSection = styled(Flex)`
  flex: 0;
`;
const BarSection = styled(Flex)`
  margin-top: 10px;
`;
const LabelText = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;
  white-space: nowrap;
  max-width: calc(100% - 85px);
  font-size: 24px;
  line-height: 24px;
`;
const TimerText = styled(Text)`
  margin-left: auto;
  font-size: 24px;
  line-height: 24px;
`;

const ProgressTimer = ({
  duration = 60,
  size,
  label,
}) => {
  const remainingSeconds = useCountdown(
    duration,
    () => console.log('onComplete!'),
  );
  const remainingMinutesText = Math.floor(remainingSeconds / 60)
    .toLocaleString(
      'en-US',
      { minimumIntegerDigits: 2 },
    );
  const remainingSecondsText = (remainingSeconds % 60)
    .toLocaleString(
      'en-US',
      { minimumIntegerDigits: 2 },
    );
  return (
    <Container>
      <TimerSection>
        <LabelText weight="bold">
          {label}
        </LabelText>
        <TimerText weight="regular">
          {`${remainingMinutesText}:${remainingSecondsText}`}
        </TimerText>
      </TimerSection>
      <BarSection>
        <ProgressBar
          percentage={Math.ceil((remainingSeconds / duration) * 100)}
          size={size}
        />
      </BarSection>
    </Container>
  );
};

export default ProgressTimer;
