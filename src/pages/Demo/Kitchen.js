import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { palette } from 'styled-theme';
import {
  v4 as uuidv4,
} from 'uuid';
import { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import Image from '../../components/atoms/Image';
import kitchenSrc from '../../assets/image/kitchen.png';
import Card from '../../components/atoms/Card';
import Flex from '../../components/atoms/Flex';
import ErrorPulse from '../../components/molecules/ErrorPulse';

const Container = styled(Flex)`
  flex: 0;
  align-self: shrink;
  background-color: transparent;
  position: absolute;
  right: 0;
  translate: 8% -2%;
`;
const Kitchen = (props) => {
  const id = useMemo(
    () => uuidv4(),
    [],
  );

  return (
    <Container
      transparent
      data-tooltip-id={id}
    >
      <Image width={370} height="auto" src={kitchenSrc} />
      <Tooltip
        id={id}
        isOpen
        style={{
          background: 'transparent',
          marginTop: '60px',
          transform: 'translate(80px)',
        }}
      >
        <ErrorPulse />
      </Tooltip>
    </Container>
  );
};

Kitchen.propTypes = {
  title: PropTypes.string,
  hourly: PropTypes.number,
  type: PropTypes.string,
  beforeTax: PropTypes.number,
  afterTax: PropTypes.number,
  date: PropTypes.string, // ISO string
};

Kitchen.defaultProps = {
  title: 'title',
  hourly: 10000,
  type: 'monthly',
  beforeTax: 321000,
  afterTax: 321000,
  date: moment().toISOString(),
};

export default Kitchen;
