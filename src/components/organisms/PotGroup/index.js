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

import IconButton from '../../molecules/IconButton';
import Input from '../../molecules/Input';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';
import Image from '../../atoms/Image';
import Card from '../../atoms/Card';

import ProgressBar from '../../molecules/ProgressBar';
import ProgressTimer from '../../molecules/ProgressTimer';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import PotControlButton from '../PotControlButton';
import PotUnit from '../PotUnit';

// const COOK_START = gql`
//   query CookStart($recipeId: Int, $option: JSON) {
//     startCooking(recipeId: $recipeId, option: $option)
//   }
// `;
// const KITCHEN_POT_SWITCH = gql`
//   mutation kitchenPotRotationSwitch($cookerId: Int) {
//     kitchenPotRotationSwitch(cookerId: $cookerId)
//   }
// `;
const PotGridContainer = styled(Flex)`
  margin: -10px 0px;
  flex-wrap: wrap;
  flex: 0;
  flex-basis: 640px;
`;
const PotCardContainer = styled(Flex)`
  padding: 10px;
  flex-basis: 50%;
`;

// const PotGroupWrapper = styled(Flex)`
//   flex-basis: 450px;
//   min-width: 450px;
//   flex: 1;
//   flex-wrap: wrap;
//   margin: -8px ${8 - 8}px;
// `;
// const PotControlButtonContainer = styled(Flex)`
//   flex-basis: 50%;
//   padding: 8px;
// `;

const PotGroup = (props) => {
  const {
    count,
    ...others
  } = props;

  return (
    <PotGridContainer>
      {_.times(6).map((i) => (
        <PotCardContainer
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
  );
};

PotGroup.propTypes = {

  // potList: PropTypes.array,
  // maxTemperature: PropTypes.number,
  // stoves: PropTypes.arrayOf(PropTypes.shape({
  //   temperature: PropTypes.number,
  //   status: PropTypes.oneOf([
  //     'on',
  //     'off',
  //   ]),
  // })),
  // order: PropTypes.shape({ id: PropTypes.number }),
  // recipe: PropTypes.shape({
  //   id: PropTypes.number,
  //   duration: PropTypes.number,
  //   name: PropTypes.string,
  // }),
};

PotGroup.defaultProps = {};

export default PotGroup;
