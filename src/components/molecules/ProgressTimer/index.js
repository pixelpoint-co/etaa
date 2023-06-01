import {
  useEffect,
  useState,
} from 'react';
import moment from 'moment';
import styled, {
  ThemeProvider,
  css,
} from 'styled-components';
import {
  font, palette,
} from 'styled-theme';
import {
  ifProp, prop, switchProp,
} from 'styled-tools';
import dayjs from 'dayjs';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';
import ProgressBar from '../ProgressBar';
import useCountdown from '../../../hooks/useCountdown';
import useTheme from '../../../hooks/useTheme';
import Icon from '../../atoms/Icon';

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
  text-align: left;
  font-size: 24px;
  line-height: 24px;
`;
const TimerText = styled(Text)`
  margin-left: auto;
  font-size: 24px;
  line-height: 24px;
  align-items: center;
  display: inline-flex;
`;
const ProgressTimer = ({
  duration = 0,
  totalDuration = 0,
  totalDurationLabel,
  containerBarColor,
  size,
  label,
  color,
  ...others
}) => {
  const {
    countdown: remainingSeconds,
    resetTimer,
  } = useCountdown(
    duration,
    // () => console.log('onComplete!'),
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
  const timeText = totalDurationLabel ? <Icon icon="play" size={16} color="white" /> : `${remainingMinutesText}:${remainingSecondsText}`;
  const infinityText = '∞';
  return (
    <Container>
      <TimerSection>
        <LabelText weight="bold" color={color}>
          {label}
        </LabelText>
        <TimerText
          weight="regular"
          color={color}
        >
          {duration === Infinity || totalDuration === Infinity ? (
            infinityText
          ) : (
            timeText
          )}
        </TimerText>
      </TimerSection>
      <BarSection>
        <ProgressBar
          percentage={(Math.ceil((remainingSeconds / (totalDuration / 1000)) * 100 * 100)) / 100}
          size={size}
          onClick={resetTimer}
          color={color}
          containerColor={containerBarColor}
        />
      </BarSection>
    </Container>
  );
};

export default ProgressTimer;
