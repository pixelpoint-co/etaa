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
import Mask from '../../atoms/Mask';
import PotControlButton from '../PotControlButton';
import PotWash from '../../atoms/PotWash';
import SwitchButton from '../../molecules/SwitchButton';
// const Wrapper = styled(Card)`
//   padding: 20px;
//   justify-content: flex-end;
//   po
// `;
const StyledMask = styled(Mask)`
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  z-index: 3;
  background-color: rgba(238, 240, 243, 0.7);
`;
const StyledSwitchButton = styled(SwitchButton)`
  margin-top: 10px;
  border-radius: 50px;
  `;
const ButtonContainer = styled(Flex)`
  margin-top: 10px;
  flex: 0;
  `;
const StyledPotButton = styled(PotControlButton)`
  min-width: 340px;
  width: 60%;
  flex-basis: 60%;
  flex: 0;
  align-self: center;
`;
const StopButton = styled(Button)`
  min-width: 340px;
  width: 60%;
`;

const LabelWrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 40px;
`;

const LabelText = styled(Text)`
  font-size: 45px;
  line-height: 45px;
  margin-top: 20px;
  font-weight: 600;
  color: inherit;
`;
const WashingMask = (props) => {
  const {
    washing,
    duration,
    washingRemainingTimeMs,
    abort,
    ...others
  } = props;

  const [
    aborted,
    setAborted,
  ] = useState(false);

  useEffect(
    () => {
      if (!washing && aborted) {
        setAborted(false);
      }
    },
    [
      aborted,
      washing,
    ],
  );

  return (
    <StyledMask visible={washing}>
      <StyledPotButton
        active
        disableClick
        duration={washingRemainingTimeMs}
        totalDuration={111000}
        label={(
          <LabelWrapper>
            <PotWash size={60} />
            <LabelText>
              세척 중
            </LabelText>
          </LabelWrapper>
        )}
      />
      {/* <ButtonContainer>
        <StopButton
          loading={aborted}
          palette="red"
          tone={0}
          themeType="solid"
          label="긴급정지"
          onClick={() => {
            setAborted(true);
            abort();
          }}
        />
      </ButtonContainer> */}
    </StyledMask>
  );
};

WashingMask.propTypes = {
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

WashingMask.defaultProps = {
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
    '[WashingMask] onClick() ',
    e,
  ),
};

export default WashingMask;
