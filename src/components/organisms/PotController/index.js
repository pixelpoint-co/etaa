import {
  gql, useMutation, useQuery,
} from '@apollo/client';
import styled, {
  css,
} from 'styled-components';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  palette, size,
} from 'styled-theme';
import {
  useState,
} from 'react';
import {
  ifProp,
} from 'styled-tools';
import {
  v4 as uuidv4,
} from 'uuid';

import Flex from '../../atoms/Flex';

import PotControlButton from '../PotControlButton';
import Modal from '../../atoms/Modal';
import usePotController from '../../../hooks/usePotController';
import WashingMask from './WashingMask';
import Extension from './Extension';

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

    lastActionType,
    lastActionId,

    prepAngle,
    rotateStart,
    resetPosition,
    prepWashing,
    startWashing,
    stopCook,
    abort,

    isWashing,
  } = usePotController(
    cookerId,
    {},
  );

  return (
    <PotControllerWrapper>
      <PotControlButtonContainer>
        <PotControlButton label="음식 담기" onClick={prepAngle} />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          duration={(potMonitoringData?.cooking && recipe.id === 21) ? recipeRemainingTimeMs : 0}
          totalDuration={(potMonitoringData?.cooking && recipe.id === 21) ? recipeDurationMs : 0}
          active={lastActionType === 'recipe' && lastActionId === 21 && potMonitoringData?.cooking}
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
            <PotControlButton label="역회전" hideLabelOnLoading />
          </PotControlButtonContainer>
          <PotControlButtonContainer>
            <PotControlButton label="원점정지" hideLabelOnLoading />
          </PotControlButtonContainer>
          <PotControlButtonContainer>
            <PotControlButton label="세척준비" hideLabelOnLoading />
          </PotControlButtonContainer>
          <PotControlButtonContainer>
            <PotControlButton
              label="..."
              onClick={() => setExtensionOpen(true)}
              hideLabelOnLoading
              fakeLoadingTime={300}
            />
          </PotControlButtonContainer>
        </PotControllerWrapper>

      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          label="작동중지"
          fakeLoadingTime={10 * 1000}
          palette="orange"
          tone={0}
          themeType="solid"
          onClick={stopCook}
        />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton label="조리시작" palette="blue" tone={0} themeType="solid" />
      </PotControlButtonContainer>

      <WashingMask washing={isWashing} abort={abort} />
      <Extension
        isOpen={extensionOpen}
        onClose={() => setExtensionOpen(false)}
      />
    </PotControllerWrapper>
  );
};

PotController.propTypes = { cookerId: PropTypes.number };

PotController.defaultProps = { cookerId: 0 };

export default PotController;
