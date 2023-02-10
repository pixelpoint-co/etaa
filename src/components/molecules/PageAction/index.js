import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from '../../atoms/Button';
import Flex from '../../atoms/Flex';

const Wrapper = styled(Flex)`
  position: fixed;
  bottom: 20px;
  left: 15px;
  right: 15px;
  flex-direction: column;
  background-color: transparent;
`;

const PageAction = ({
  actions,
  children,
  ...others
}) => (
  <Wrapper>
    {actions.map(({
      action,
      label,
      ...otherActionProps
    }) => (
      <Button
        key={label}
        label={label}
        onClick={action}
        {...otherActionProps}
      />
    ))}
    {children}
  </Wrapper>
);

PageAction.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    action: PropTypes.func,
  })),
  children: PropTypes.node,
};

PageAction.defaultProps = {
  actions: [{
    action: () => console.log('action'),
    label: 'pageactionbutton',
  }],
  children: null,
};

export default PageAction;
