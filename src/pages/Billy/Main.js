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
import OrderMonitor from '../../containers/OrderMonitor';
import Link from '../../components/atoms/Link';

const Wrapper = styled(Flex)`
  flex-direction: row;
  align-items: stretch;
  padding: 20px 10px;
`;

const OrderMonitorContainer = styled(Card)`
  flex: 1;
  flex-basis: 640px;
`;
const PotGridContainer = styled(Flex)`
  margin: -10px 0px;
  flex-wrap: wrap;
  flex: 1;
  flex-basis: 640px;
`;
const PotCardContainer = styled(Link)`
  display: flex;
  flex: 1;
  margin: 10px;
  flex-basis: 45%;
`;

const BillyMain = (props) => {
  const location = useLocation();

  const { ...others } = props;

  return (
    <Wrapper>
      <OrderMonitorContainer>
        <OrderMonitor
          pickCellRenderers={(cellRenderers) => {
            return cellRenderers.filter((cr) => ['action'].indexOf(cr.dataIndex) < 0);
          }}
        />
      </OrderMonitorContainer>
      {/* <PotGridContainer>
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
      </PotGridContainer> */}
    </Wrapper>
  );
};

BillyMain.propTypes = { };
BillyMain.defaultProps = { };

export default BillyMain;
