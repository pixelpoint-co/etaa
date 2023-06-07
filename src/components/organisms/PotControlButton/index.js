import styled, {
  css,
} from 'styled-components';
import PropTypes from 'prop-types';
import {
  palette, size,
} from 'styled-theme';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ifProp,
} from 'styled-tools';
import {
  gql, useQuery,
} from '@apollo/client';
import _ from 'lodash';
import IconButton from '../../molecules/IconButton';
import Input from '../../molecules/Input';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';
import Image from '../../atoms/Image';
import Card from '../../atoms/Card';

import ProgressBar from '../../molecules/ProgressBar';
import ProgressTimer from '../../molecules/ProgressTimer';
import TooltipMask from '../../molecules/TooltipMask';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import theme from '../../../theme';
// const Wrapper = styled(Card)`
//   padding: 20px;
//   justify-content: flex-end;
//   po
// `;

const StyledButton = styled(Button)`
  padding: 20px;
  position: relative;
  flex: 1;

  ${ifProp(
    'active',
    css`
      box-shadow: rgba(30, 30, 30, 0.3) 5px 5px 20px;
    `,
  )}
  font-size: 35px;
  line-height: 35px;
  .button-label-container p {
    font-weight: 700;
  }
`;

const TimerContainer = styled(Flex)`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 20px;
  opacity: 1;
  font-weight: normal;
  /* ${ifProp(
    'active',
    css`
      opacity: 1;
    `,
  )} */
`;
const PotControlButton = (props) => {
  const {
    active,
    recipeId,
    onClick,
    duration = 0,
    durationLabel,
    totalDuration = 0,
    totalDurationLabel,
    fakeLoadingTime = 2000,
    loading,
    timerColor,
    containerBarColor,
    disabled,
    disabledTooltip = [],
    onTimerComplete,
    ...others
  } = props;
  const [
    tempLoading,
    setTempLoading,
  ] = useState(false);
  const loadingRef = useRef(null);

  const handleClick = useCallback(
    (e) => {
      setTempLoading(true);
      onClick(e);

      loadingRef.current = setTimeout(
        () => {
          setTempLoading(false);
        },
        fakeLoadingTime,
      );
    },
    [
      onClick,
      fakeLoadingTime,
    ],
  );

  useEffect(
    () => {
      return () => {
        clearTimeout(loadingRef.current);
      };
    },
    [],
  );
  const disabledTooltipList = disabledTooltip.filter((v) => !_.isNull(v)).join(', ');
  return (
    <StyledButton
      palette="grayscale"
      tone={0}
      themeType="text"
      {...(active ? {
        palette: 'black',
        tone: 0,
        themeType: 'solid',
      } : {})}
      active={active}
      {...others}
      // disabled={disabled}
      {...((active)
        ? { disableClick: disabled }
        : { disabled }
      )}
      onClick={handleClick}
      loading={tempLoading || loading}
    >
      {(totalDuration > 0) ? (
        <TimerContainer>
          <ProgressTimer
            color={timerColor}
            containerBarColor={containerBarColor}
            {...(active ? {
              color: 'white',
              containerBarColor: theme.palette.grayscale[2],
            } : {})}
            label={durationLabel}
            totalDuration={totalDuration}
            duration={duration}
            totalDurationLabel={totalDurationLabel}
            onComplete={() => {
              console.log('progress timer onTimerComplete');
              onTimerComplete();
            }}
            labelSize={18}
          />
        </TimerContainer>
      ) : null}
      <TooltipMask
        visible={!!(disabled && disabledTooltipList)}
        content={disabledTooltip.filter((v) => !_.isNull(v)).join(', ')}
      />
    </StyledButton>
  );
};

PotControlButton.propTypes = {
  maxTemperature: PropTypes.number,
  stoves: PropTypes.arrayOf(PropTypes.shape({
    temperature: PropTypes.number,
    status: PropTypes.oneOf([
      'on',
      'off',
    ]),
  })),
  order: PropTypes.shape({ id: PropTypes.number }),
  recipe: PropTypes.shape({
    id: PropTypes.number,
    duration: PropTypes.number,
    name: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

PotControlButton.defaultProps = {
  maxTemperature: 350,
  stoves: [
    {
      status: 'on',
      temperature: 60,
    },
    {
      status: 'on',
      temperature: 90,
    },
  ],
  order: {
    id: null,
    recipeList: [
      1,
      2,
    ],
  },
  recipe: {
    id: null,
    duration: 60,
    name: '레시피이름',
  },
  onClick: (e) => console.log(
    '[PotControlButton] onClick() ',
    e,
  ),
  timerColor: 'black',
  disabledTooltip: [],
};

export default PotControlButton;
