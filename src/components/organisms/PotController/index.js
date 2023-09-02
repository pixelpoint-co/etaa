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
  max-width: 50%;
`;

const PotController = (props) => {
  const { potController } = props;
  const [
    extensionOpen,
    setExtensionOpen,
  ] = useState(false);
  const [
    recipeModalOpen,
    setRecipeModalOpen,
  ] = useState(false);
  const {
    startSpin,
    // cookerMonitoringError,
    // cookerMonitoringData,
    // cookerMonitoringLoading,

    // subscriptionData,
    // subscriptionLoading,

    // fetchMonitoring,
    // subscriptionTime,

    recipeRemainingTimeMs,
    recipeDurationMs,

    startCook,
    currentRecipe,
    currentRecipeId,
    lastActionType,
    lastActionId,
    setLastActionType,
    setLastActionId,
    machineState,
    finishCook,
    tiltHome,
    prepCook,
    spinHome,
    prepWash,
    startWash,
    stopCook,
    abort,

    selectRecipe,
    selectedRecipe,
    // setSelectedRecipeId, // 선택된 레시피.  startRecipe에 들어가는 id 의 기본값
    isCooking,
    isWashing,
  } = potController;
  console.log({ machineState });
  const closeExtension = useCallback(
    () => {
      setExtensionOpen(false);
    },
    [setExtensionOpen],
  );
  const closeRecipeModal = useCallback(
    () => {
      setRecipeModalOpen(false);
    },
    [setRecipeModalOpen],
  );
  const openRecipeModal = useCallback(
    () => {
      setRecipeModalOpen(true);
    },
    [setRecipeModalOpen],
  );

  return (
    <PotControllerWrapper>
      <PotControlButtonContainer>
        <PotControlButton
          label="조리준비"
          onClick={() => {
            prepCook();
          }}
        />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          label="레시피 선택"
          onClick={openRecipeModal}
          disabled={isCooking}
          disabledTooltip={[isCooking ? '조리중입니다' : null]}
        />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          label="음식 담기"
          onClick={finishCook}
          disabled={isCooking}
          disabledTooltip={[isCooking ? '조리중입니다' : null]}
        />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          label="세척"
          onClick={() => {
            startWash();
          }}
          disabled={isCooking}
          disabledTooltip={[isCooking ? '조리중입니다' : null]}
        />
      </PotControlButtonContainer>

      <PotControlButtonContainer>
        <PotControlButton
          duration={(isCooking && currentRecipeId === 21) ? recipeRemainingTimeMs : 0}
          totalDuration={(isCooking && currentRecipeId === 21) ? recipeDurationMs : 0}
          active={isCooking && currentRecipeId === 21}
          label="추가 조리"
          onClick={() => {
            startCook({ recipeId: 21 });
          }}
          disabled={
            isCooking
            || machineState.tilt !== 45
          }
          disabledTooltip={[
            isCooking ? '조리중입니다' : null,
            machineState.tilt !== 45 ? '조리준비가 되어있는지 확인해주세요' : null,
          ]}
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
            || machineState.tilt !== 45
          }
          disabledTooltip={[
            isCooking ? '조리중입니다' : null,
            !selectedRecipe ? '레시피를 선택해야 합니다' : null,
            machineState.tilt !== 45 ? '조리준비가 되어있는지 확인해주세요' : null,
          ]}
          label="조리시작"
          palette="primary"
          tone={0}
          themeType="solid"
          onClick={() => startCook()}
          timerColor={theme.palette.white[0]}
          {...(isCooking && currentRecipeId !== 21 ? (
            {
              durationLabel: currentRecipe?.name,
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
          // onTimerComplete={() => {
          //   selectRecipe(null);
          // }}
        />
      </PotControlButtonContainer>

      <WashingMask washing={isWashing} abort={abort} />
      <Extension
        isOpen={extensionOpen}
        menuOptionsOpen={recipeModalOpen}
        onMenuOptionsClose={closeRecipeModal}
        isCooking={isCooking}
        onClose={closeExtension}
        tiltHome={tiltHome}
        prepCook={prepCook}
        selectRecipe={selectRecipe}
        startSpin={startSpin}
        lastActionType={lastActionType}
        lastActionId={lastActionId}
        spinHome={spinHome}
        prepWash={prepWash}
        machineState={machineState}
        onRecipeSelect={() => {
          setExtensionOpen(false);
          setRecipeModalOpen(true);
        }}
      />
    </PotControllerWrapper>
  );
};

PotController.propTypes = { cookerId: PropTypes.number };

PotController.defaultProps = { cookerId: 0 };

export default PotController;
