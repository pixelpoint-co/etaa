import {
  gql, useMutation, useQuery,
} from '@apollo/client';
import styled, {
  css,
} from 'styled-components';
import PropTypes from 'prop-types';
import _, {
  get,
} from 'lodash';
import {
  palette, size,
} from 'styled-theme';
import {
  useCallback,
  useState,
} from 'react';
import {
  ifProp,
} from 'styled-tools';
import {
  v4 as uuidv4,
} from 'uuid';

import {
  ToastContainer, toast,
} from 'react-toastify';
import Flex from '../../atoms/Flex';

import PotControlButton from '../PotControlButton';
import Modal from '../../atoms/Modal';
import usePotController from '../../../hooks/usePotController';
import WashingMask from './WashingMask';
import Extension from './Extension';
import theme from '../../../theme';

const PotControllerWrapper = styled(Flex)`
  position: relative;
  flex-basis: 450px;
  flex-wrap: wrap;
  align-self: stretch;
  margin: -8px;
`;
const PotControlButtonContainer = styled(Flex)`
  padding: 8px;
  flex: 1 0 50%;
  flex-wrap: wrap;
  flex-direction: row;
`;

const PotController = (props) => {
  const { cookerId } = props;
  const [
    extensionOpen,
    setExtensionOpen,
  ] = useState(false);
  const {
    // cookerMonitoringError,
    // cookerMonitoringData,
    // cookerMonitoringLoading,

    // subscriptionData,
    // subscriptionLoading,

    // fetchMonitoring,
    // subscriptionTime,

    recipeRemainingTimeMs,
    recipeDurationMs,

    potMonitoringData,

    startRecipe,
    recipe,
    currentRecipeId,
    lastActionType,
    lastActionId,
    setLastActionType,
    setLastActionId,

    prepAngle,
    prepIngredientAngle,
    prepNoodle,
    rotateStart,
    resetPosition,
    prepWashing,
    startWashing,
    stopCook,
    abort,

    selectRecipe,
    selectedRecipe,
    setSelectedRecipeId, // 선택된 레시피.  startRecipe에 들어가는 id 의 기본값
    isCooking,

    isWashing,
  } = usePotController(
    cookerId,
    {},
  );
  console.log(
    'fff',
    lastActionType,
    lastActionId,
    recipeRemainingTimeMs,
    recipeDurationMs,
  );
  const closeExtension = useCallback(
    () => {
      console.log('선택 closing extension');
      setExtensionOpen(false);
    },
    [setExtensionOpen],
  );
  return (
    <PotControllerWrapper>
      <ToastContainer enableMultiContainer />
      <PotControlButtonContainer>
        <PotControlButton label="음식 담기" onClick={prepAngle} />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          duration={(potMonitoringData?.cooking && recipe.id === 21) ? recipeRemainingTimeMs : 0}
          totalDuration={(potMonitoringData?.cooking && recipe.id === 21) ? recipeDurationMs : 0}
          active={isCooking && recipe.id === 21}
          label="추가 조리"
          onClick={() => {
            startRecipe(21);
          }}
        />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton label="세척" onClick={startWashing} />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControllerWrapper>
          <PotControlButtonContainer>
            <PotControlButton
              label="역회전"
              hideLabelOnLoading
              onClick={rotateStart}
              active={lastActionType === 'machine' && lastActionId === '역회전'}
            />
          </PotControlButtonContainer>
          <PotControlButtonContainer>
            <PotControlButton
              label="원점정지"
              hideLabelOnLoading
              onClick={resetPosition}
              active={lastActionType === 'machine' && lastActionId === '원점정지'}
            />
          </PotControlButtonContainer>
          <PotControlButtonContainer>
            <PotControlButton
              label="세척준비"
              hideLabelOnLoading
              onClick={prepWashing}
              active={lastActionType === 'machine' && lastActionId === '세척준비'}
            />
          </PotControlButtonContainer>
          <PotControlButtonContainer>
            <PotControlButton
              label="···"
              onClick={() => setExtensionOpen(true)}
              hideLabelOnLoading
              fakeLoadingTime={300}
            />
          </PotControlButtonContainer>
        </PotControllerWrapper>

      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          label="조리중지"
          fakeLoadingTime={10 * 1000}
          palette="orange"
          tone={0}
          themeType="solid"
          onClick={() => {
            stopCook();
          }}
        />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          disabled={
            !(!isCooking && selectedRecipe)
          }
          disabledTooltip={[
            isCooking ? '이미 조리중입니다' : null,
            !selectedRecipe ? '레시피를 선택해야 합니다' : null,
          ]}
          label="조리시작"
          palette="blue"
          tone={0}
          themeType="solid"
          onClick={() => startRecipe(selectedRecipe.id)}
          timerColor={theme.palette.white[0]}
          {...(isCooking && currentRecipeId !== 21 ? (
            {
              durationLabel: recipe.name,
              duration: recipeRemainingTimeMs,
              totalDuration: recipeDurationMs,
            }
          ) : {})}
          {...(!isCooking && selectedRecipe ? (
            {
              durationLabel: selectedRecipe.name,
              duration: 0,
              totalDuration: selectedRecipe.detail.duration,
              totalDurationLabel: '||',
            }
          ) : {})}
        />
      </PotControlButtonContainer>

      <WashingMask washing={isWashing} abort={abort} />
      <Extension
        isOpen={extensionOpen}
        isCooking={isCooking}
        onClose={closeExtension}
        prepIngredientAngle={prepIngredientAngle}
        prepNoodle={prepNoodle}
        selectRecipe={selectRecipe}
      />
    </PotControllerWrapper>
  );
};

PotController.propTypes = { cookerId: PropTypes.number };

PotController.defaultProps = { cookerId: 0 };

export default PotController;
