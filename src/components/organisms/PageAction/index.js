import PropTypes from 'prop-types';
import {
  useEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import startCase from 'lodash/startCase';

import {
  ifProp,
} from 'styled-tools';
import {
  palette, size,
} from 'styled-theme';

import {
  Space,
} from 'antd';
import Button from '../../atoms/Button';
import Flex from '../../atoms/Flex';
import Divider from '../../atoms/Divider';

const Wrapper = styled(Flex)`
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;

  padding: 20px 12px;

  flex-direction: row;
  justify-content: flex-end;

  background-color: rgba(255,255,255,0.4);
  backdrop-filter: blur(16px) brightness(100%);


  @media (min-width: ${size('mobileBreakpoint')}) {
    left: calc(250px + 0px);
  }
`;

const ActionButton = styled(Button)`
  min-width: 320px;
  padding: 20px;
  font-size: 30px;
  line-height: 36px;
`;

const PageAction = ({
  actions,
  children,
  ...others
}) => {
  const [
    height,
    setHeight,
  ] = useState(0);
  const ref = useRef(null);

  useEffect(
    () => {
      setHeight(ref.current.clientHeight);
    },
    [],
  );

  return (
    <>
      <Divider verticalMargin={((height + 20) / 2)} />
      <Wrapper ref={ref}>
        {actions.map(({
          action,
          label,
          ...otherActionProps
        }) => (
          <ActionButton
            key={label}
            label={label}
            onClick={action}
            {...otherActionProps}
          />
        ))}
        {children}
      </Wrapper>
    </>
  );
};

PageAction.defaultProps = {
  actions: [{
    action: () => console.log('action'),
    label: 'pageactionbutton',
  }],
};

PageAction.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.func,
    label: PropTypes.string,
  })),
};

export default PageAction;
