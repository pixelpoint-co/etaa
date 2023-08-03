// import { connect } from 'react-redux';
import {
  useLocation,
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
import propTypes from '../../propTypes';
import Heading from '../../components/atoms/Heading';
import Card from '../../components/atoms/Card';
import PageAction from '../../components/organisms/PageAction/index';
import AntDList from '../../components/organisms/AntDList';
import PotUnit from '../../components/organisms/PotUnit';
import ControlMonitor from '../../containers/ControlMonitor';
import Link from '../../components/atoms/Link';
import OrderMonitor from '../../containers/OrderMonitor';
import useChefMonitor from '../../hooks/useChefMonitor';
import usePotController from '../../hooks/usePotController';

const Wrapper = styled(Flex)`
  flex-direction: row;
  align-items: stretch;
  padding: 20px 10px;
`;

const ControlMonitorContainer = styled(Card)`
  flex-basis: 640px;
`;
const PotGridContainer = styled(Flex)`
  margin: -10px 0px;
  flex-wrap: wrap;
  flex: 1;
  flex-basis: 640px;
  align-self: flex-start;
`;
const PotCardContainer = styled(Link)`
  display: flex;
  flex: 1;
  margin: 10px;
  flex-basis: 45%;
`;

const ControlTowerMain = (props) => {
  const location = useLocation();
  const { eKQueue } = useChefMonitor();

  const { ...others } = props;

  return (
    <Wrapper>
      <ControlMonitorContainer>
        <OrderMonitor
          pageSize={12}
          pickCellRenderers={(cellRenderers) => cellRenderers.filter(({ dataIndex }) => [
            'dateTimeISO',
            'channelNo',
            'orderPlatform',
            'outsideId',
            'item',
            'qty',
            'status',
            'orderKitchen',
            'cookStation',
          ].indexOf(dataIndex) > -1)}
        />
      </ControlMonitorContainer>
      <PotGridContainer>
        {_.times(6).map((i) => (
          <PotCardContainer
            key={i}
            href={`${window.origin}/gates/${i + 1}`}
          >
            <PotUnit
              cookerId={i}
            />
          </PotCardContainer>
        ))}
      </PotGridContainer>
    </Wrapper>
  );
};

ControlTowerMain.propTypes = { };
ControlTowerMain.defaultProps = { };

export default ControlTowerMain;
