import styled, {
  css,
} from 'styled-components';
import PropTypes from 'prop-types';
import Flex from '../../atoms/Flex';

import PotControlButton from '../PotControlButton';

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
  const {
    rotateStart,
    rotateStop,
  } = potController;

  return (
    <PotControllerWrapper>
      <PotControlButtonContainer>
        <PotControlButton
          label="회전시작"
          onClick={() => {
            rotateStart();
          }}
        />
      </PotControlButtonContainer>
      <PotControlButtonContainer>
        <PotControlButton
          label="회전정지"
          onClick={() => {
            rotateStop();
          }}
        />
      </PotControlButtonContainer>
      <PotControlButtonContainer />
      <PotControlButtonContainer />
      <PotControlButtonContainer />
      <PotControlButtonContainer />
    </PotControllerWrapper>
  );
};

PotController.propTypes = { cookerId: PropTypes.number };

PotController.defaultProps = { cookerId: 0 };

export default PotController;
