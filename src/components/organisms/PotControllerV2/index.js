import styled, {
  css,
} from 'styled-components';
import PropTypes from 'prop-types';
import {
  useCallback, useState,
} from 'react';
import Flex from '../../atoms/Flex';

import PotControlButton from '../PotControlButton';
import Extension from './Extension';
import WashingMask from './WashingMask';
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
  flex: 1 0 33%;
  flex-wrap: wrap;
  flex-direction: row;
  max-width: 33%;
`;

const PotController = (props) => {
  const { potController } = props;
  const {
    spinStart,
    spinStop,
    selectRecipe,
    selectedRecipe,
    selectedRecipeId,
    startCook,
    prepCook,
    isCooking,
    home,
    finishCook,
    spinHome,
    startWash,
    prepWash,
    stopCook,
  } = potController;
  console.log(selectedRecipe);
  const [
    extensionOpen,
    setExtensionOpen,
  ] = useState(false);
  const [
    recipeModalOpen,
    setRecipeModalOpen,
  ] = useState(false);

  const openRecipeModal = useCallback(
    () => {
      setRecipeModalOpen(true);
    },
    [setRecipeModalOpen],
  );
  const closeRecipeModal = useCallback(
    () => {
      setRecipeModalOpen(false);
    },
    [setRecipeModalOpen],
  );
  const closeExtension = useCallback(
    () => {
      setExtensionOpen(false);
    },
    [setExtensionOpen],
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
          label="음식담기"
          onClick={finishCook}
          disabled={isCooking}
          disabledTooltip={[isCooking ? '조리중입니다' : null]}
        />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          label="회전원점"
          onClick={spinHome}
          disabled={isCooking}
          disabledTooltip={[isCooking ? '조리중입니다' : null]}
        />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          label="세척"
          onClick={() => {
            startWash();
            selectRecipe(null);
          }}
          disabled={isCooking}
          disabledTooltip={[isCooking ? '조리중입니다' : null]}
        />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          // duration={(potMonitoringData?.cooking && recipe.id === 21) ? recipeRemainingTimeMs : 0}
          // totalDuration={(potMonitoringData?.cooking && recipe.id === 21) ? recipeDurationMs : 0}
          // active={isCooking && recipe.id === 21}
          label="추가 조리"
          onClick={() => {
            startCook({ recipeId: 21 });
          }}
          disabled={
            isCooking
            // || machineState.tilt !== 45
          }
          disabledTooltip={[isCooking ? '조리중입니다' : null,
            // machineState.tilt !== 45 ? '조리준비가 되어있는지 확인해주세요' : null,
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
          onClick={stopCook}
        />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          // disabled={
          //   !(!isCooking && selectedRecipe)
          //   || machineState.tilt !== 45
          // }
          // disabledTooltip={[
          //   isCooking ? '조리중입니다' : null,
          //   !selectedRecipe ? '레시피를 선택해야 합니다' : null,
          //   machineState.tilt !== 45 ? '조리준비가 되어있는지 확인해주세요' : null,
          // ]}
          label="조리시작"
          palette="primary"
          tone={0}
          themeType="solid"
          onClick={() => startCook()}
          timerColor={theme.palette.white[0]}
          // {...(isCooking && currentRecipeId !== 21 ? (
          //   {
          //     durationLabel: recipe.name,
          //     duration: recipeRemainingTimeMs,
          //     totalDuration: recipeDurationMs,
          //   }
          // ) : {})}
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
      <WashingMask washing={false} abort={null} />
      <Extension
        isOpen={extensionOpen}
        menuOptionsOpen={recipeModalOpen}
        onMenuOptionsClose={closeRecipeModal}
        isCooking={false}
        onClose={closeExtension}
        prepIngredientAngle={null}
        prepNoodle={null}
        selectRecipe={selectRecipe}
        spinStart={spinStart}
        home={home}
        // lastActionType={lastActionType}
        // lastActionId={lastActionId}
        // resetPosition={resetPosition}
        prepWash={prepWash}
        // machineState={machineState}
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
