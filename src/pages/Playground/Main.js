// import { connect } from 'react-redux';
import {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  useParams,
} from 'react-router-dom';

import styled from 'styled-components';
import _ from 'lodash';
import {
  size,
} from 'styled-theme';
import {
  palette,
} from 'styled-tools';

import Text from '../../components/atoms/P';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import Heading from '../../components/atoms/Heading';
import Card from '../../components/atoms/Card';
import AntDList from '../../components/organisms/AntDList';
import PotUnit from '../../components/organisms/PotUnit';
import ProgressTimer from '../../components/molecules/ProgressTimer';
import Label from '../../components/atoms/Label';

import PotController from '../../components/organisms/PotController';
import PotGroup from '../../components/organisms/PotGroup';
import Select from '../../components/atoms/Select';
import SwitchButton from '../../components/molecules/SwitchButton';

const Wrapper = styled(Flex)`
  /* flex-direction: row; */
  align-items: stretch;
  padding: 15px;
`;
const HeaderSection = styled(Flex)`
  align-items: center;
  flex: 0;
`;

const PotNumber = styled(Heading)`
  font-size: 45px;
  line-height: 45px;
  font-weight: 700;
  margin-left: 15px;
`;

const TimerSection = styled(Card)`
  margin-left: 55px;
  background-color: ${palette(
    'grayscale',
    4,
  )};
  padding: 10px 20px;
`;
const BodySection = styled(Flex)`
  flex-direction: row;
  margin: 15px -8px;
`;
const BodyColumn = styled(Flex)`
  margin: 0px 8px;
`;
const PotControllerWrapper = styled(BodyColumn)`
  flex-basis: 450px;
  min-width: 450px;
  max-width: 450px;
  flex: 0;
  flex-wrap: wrap;
  margin: -8px ${8 - 8}px;
`;
const PotControlButtonContainer = styled(Flex)`
  flex-basis: 50%;
  padding: 8px;
`;

const ActivateButton = styled(Button)`
  margin-left: 15px;
`;

const OrderListCard = styled(Card)`
`;
const PotGridContainer = styled(Flex)`
  margin: -10px 0px;
  flex-wrap: wrap;
  flex: 0;
  flex-basis: 640px;
`;
const PotCardContainer = styled(Flex)`
  padding: 10px;
`;

const PlaygroundMain = (props) => {
  const {
    pot,
    ...others
  } = props;

  const { id } = useParams();

  const [
    controllerPotIndex,
    setControllerPotIndex,
  ] = useState(Number(id));
  const options = _.times(
    6,
    (i) => ({
      value: i,
      label: i + 1,
    }),
  );
  return (
    <Wrapper>
      <Flex direction="column">
        <PotUnit cookerId={controllerPotIndex} style={{ flex: 0 }} />
      </Flex>
      <Flex direction="column">
        <PotController cookerId={controllerPotIndex} />
      </Flex>
    </Wrapper>
  );
};

PlaygroundMain.propTypes = {
  pot: PropTypes.shape({
    number: PropTypes.number,
    label: PropTypes.string,
  }),
};
PlaygroundMain.defaultProps = {
  pot: {
    number: 1,
    label: 'pot-label',
  },
};

export default PlaygroundMain;
