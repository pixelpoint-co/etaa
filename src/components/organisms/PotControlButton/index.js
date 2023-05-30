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
import IconButton from '../../molecules/IconButton';
import Input from '../../molecules/Input';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';
import Image from '../../atoms/Image';
import Card from '../../atoms/Card';

import ProgressBar from '../../molecules/ProgressBar';
import ProgressTimer from '../../molecules/ProgressTimer';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
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
  p {
    font-size: 20px;
    line-height: 20px;
  }
`;
const TimerContainer = styled(Flex)`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 20px;
  opacity: 0;

  ${ifProp(
    'active',
    css`
      opacity: 1;
    `,
  )}
`;
const PotControlButton = (props) => {
  const {
    active,
    recipeId,
    onClick,
    duration = 0,
    durationLabel,
    totalDuration = 0,
    fakeLoadingTime = 2000,
    loading,
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
      onClick={handleClick}
      loading={tempLoading || loading}
    >
      {(totalDuration > 0) ? (
        <TimerContainer active={active}>
          <ProgressTimer
            color={active ? 'white' : 'black'}
            label={durationLabel}
            totalDuration={totalDuration}
            duration={duration}
          />
        </TimerContainer>
      ) : null}
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
};

export default PotControlButton;
