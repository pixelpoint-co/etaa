import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  palette, size,
} from 'styled-theme';
import {
  useState,
} from 'react';
import IconButton from '../../molecules/IconButton';
import Input from '../../molecules/Input';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';
import Image from '../../atoms/Image';
import Card from '../../atoms/Card';

import potImageSrc from '../../../assets/image/pot.png';
import ProgressBar from '../../molecules/ProgressBar';
import ProgressTimer from '../../molecules/ProgressTimer';

const Wrapper = styled(Card)`
  padding: 20px;
  justify-content: flex-end;
`;
const Content = styled(Flex)`
  position: relative;
  flex-direction: column;
  flex: 0;
`;
const PotSection = styled(Flex)`
  flex: 0;
  margin: 5px auto 0px auto;
  align-self: stretch;
  width: 100%;
  justify-content: center;
`;
const StyledImage = styled(Image)`
  margin: 0px 15px 0px 15px;
  max-width: 120px;
  width: 40%;
`;
const OrderRecipeSection = styled(Flex)`
  flex-direction: column;
  margin-top: 18px;
`;
const OrderName = styled(Text)`
  color: ${palette(
    'grayscale',
    2,
  )};
  font-size: 18px;
  line-height: 18px;
`;
const ProgressTimerContainer = styled(Flex)`
  margin-top: 8px;
`;

const PotUnit = (props) => {
  const {
    maxTemperature,
    stoves,
    order,
    recipe,
    error,
    ...others
  } = props;
  return (
    <Wrapper {...others} hasError={!!error}>
      <Content>
        <PotSection>
          <ProgressBar direction="vertical" size={5} percentage={50} palette="orange" />
          <StyledImage
            src={potImageSrc}
          />
          <ProgressBar direction="vertical" size={5} percentage={50} palette="orange" />
        </PotSection>
        <OrderRecipeSection>
          <OrderName>
            {order.id}
          </OrderName>
          <ProgressTimerContainer>
            <ProgressTimer
              label={recipe.name}
              duration={recipe.duration}
            />
          </ProgressTimerContainer>
        </OrderRecipeSection>
      </Content>
    </Wrapper>
  );
};

PotUnit.propTypes = {
  maxTemperature: PropTypes.number,
  stoves: PropTypes.arrayOf(PropTypes.shape({
    temperature: PropTypes.number,
    status: PropTypes.oneOf([
      'on',
      'off',
    ]),
  })),
  order: PropTypes.shape({ id: PropTypes.number }),
  recipe: PropTypes.shape({
    id: PropTypes.number,
    duration: PropTypes.number,
    name: PropTypes.string,
  }),
};

PotUnit.defaultProps = {
  maxTemperature: 350,
  stoves: [
    {
      status: 'on',
      temperature: 60,
    },
    {
      status: 'on',
      temperature: 90,
    },
  ],
  order: {
    id: 'i-am-some-order-id',
    recipeList: [
      1,
      2,
    ],
  },
  recipe: {
    id: 'some-recipe-id',
    duration: 60,
    name: '레시피이름',
  },
};

export default PotUnit;
