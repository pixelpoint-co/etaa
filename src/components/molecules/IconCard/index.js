import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { palette } from 'styled-theme';

import Card from '../../atoms/Card';
import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';

const IconCard = ({
  icon,
  src,
  label,
  ...props
}) => {
  return (
    <Card
      white
      {...props}
    >
      <Image height={80} width={80} src={src} />
      <Text>{label}</Text>
    </Card>
  );
};

IconCard.propTypes = {};

IconCard.defaultProps = {};

export default IconCard;
