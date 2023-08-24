import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  v4 as uuidv4,
} from 'uuid';
import {
  Tooltip,
} from 'react-tooltip';

import styled from 'styled-components';
import { prop } from 'styled-tools';
import Flex from '../../atoms/Flex';
import Mask from '../../atoms/Mask';

const StyledMask = styled(Mask)`
  background: none;
  z-index: ${prop('$zIndex')};
`;

const TooltipMask = (props) => {
  const {
    visible,
    content,
    zIndex,
    ...others
  } = props;

  const id = useMemo(
    () => uuidv4(),
    [],
  );

  if (!visible) return null;

  return (
    <StyledMask
      data-tooltip-id={id}
      data-tooltip-content={content}
      visible={visible}
      $zIndex={zIndex}
    >
      <Tooltip id={id} />
    </StyledMask>
  );
};

TooltipMask.defaultProps = {
  visible: false,
  zIndex: 2,
};

TooltipMask.propTypes = {
  visible: PropTypes.bool,
  zIndex: PropTypes.number,
};

export default TooltipMask;
