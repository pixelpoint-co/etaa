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
import Link from '../../components/atoms/Link';

const Wrapper = styled(Flex)`
  flex-direction: row;
  align-items: stretch;
  padding: 20px 10px;
`;

const OrderListCard = styled(Card)`
  padding: 20px;
  margin: 0px 10px;
  flex-direction: column;
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
      {/* <OrderListCard>
        <AntDList
          RowComponent={() => <div>some-row</div>}
          dataSource={_.times(10)}
        />
      </OrderListCard> */}
      <PotGridContainer>
        {_.times(6).map((i) => (
          <PotCardContainer
            key={i}
            to={`/gates/${i + 1}`}
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

BillyMain.propTypes = { };
BillyMain.defaultProps = { };

export default BillyMain;