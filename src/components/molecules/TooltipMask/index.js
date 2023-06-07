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
import Flex from '../../atoms/Flex';
import Mask from '../../atoms/Mask';

const StyledMask = styled(Mask)`
  background: none;
  z-index: 3;
`;

const TooltipMask = (props) => {
  const {
    visible,
    content,
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
    >
      <Tooltip id={id} />
    </StyledMask>
  );
};

TooltipMask.defaultProps = { visible: false };

TooltipMask.propTypes = { visible: PropTypes.bool };

export default TooltipMask;
