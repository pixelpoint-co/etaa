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
  flex: 0;
  flex-basis: 640px;
`;
const PotCardContainer = styled(Flex)`
  padding: 10px;
`;

const BillyMain = (props) => {
  const location = useLocation();

  const { ...others } = props;

  return (
    <Wrapper>
      <OrderListCard>
        <AntDList
          RowComponent={() => <div>some-row</div>}
          dataSource={_.times(10)}
        />
      </OrderListCard>
      <PotGridContainer>
        {_.times(6).map((i) => (
          <PotCardContainer
            style={{ flexBasis: '300px' }}
            key={i}
          >
            <PotUnit
              error={(i % 2) > 0 ? 'some-error-text' : null}
              stoves={[
                {
                  status: 'on',
                  temperature: 60,
                },
                {
                  status: 'on',
                  temperature: 90,
                },
              ]}
              order={{
                id: 'i-am-some-order-id',
                recipeList: [
                  1,
                  2,
                ],
              }}
              recipe={{
                id: 'some-recipe-id',
                duration: 60,
                name: '레시피이름',
              }}
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
