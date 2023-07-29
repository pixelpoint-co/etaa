import {
  useEffect,
  useMemo,
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
  font-size: ${prop('$size')}px;
  line-height: ${prop('$size')}px;
`;
const TimerText = styled(Text)`
  margin-left: auto;
  font-size: ${prop('$size')}px;
  line-height: ${prop('$size')}px;
  align-items: center;
  display: inline-flex;
`;
const CountDown = (props) => {
  const {
    completionTimeMs,
    shorten = false,
    ...others
  } = props;
  const durationMS = useMemo(
    () => completionTimeMs - Date.now(),
    [completionTimeMs],
  );

  const { countdown: remainingSeconds } = useCountdown(
    durationMS,
    () => {},
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
  const timeText = `${remainingMinutesText}:${remainingSecondsText}`;
  const shortText = remainingSeconds > 60 ? `${(Math.floor(remainingSeconds / 60) + 1)}분` : remainingSeconds;
  return (
    <TimerText
      weight="bold"
      {...others}
    >
      {shorten ? shortText : timeText}
    </TimerText>
  );
};

export default CountDown;
