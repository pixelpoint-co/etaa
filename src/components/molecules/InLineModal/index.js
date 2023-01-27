import PropTypes from 'prop-types';
import styled from 'styled-components';
import startCase from 'lodash/startCase';
import { palette } from 'styled-theme';
import { ifProp } from 'styled-tools';

import Link from '../../atoms/Link';
import Flex from '../../atoms/Flex';
import Button from '../../atoms/Button';
import Icon from '../../atoms/Icon';

const Wrapper = styled(Flex)`
  display: flex;
  flex-direction: column;
`;

const Container = styled(Flex)`
  justify-content: space-between;
  background-color: ${palette('black', 0)};
  border-radius: 12px;
  flex-direction: row;
  padding: 20px;
  margin-top: 28px;
  position: relative;
`;

const Content = styled(Flex)`
  color: ${palette('white', 0)};
  font-size: 14px;
  line-height: 20px;
`;

const CaretContainer = styled(Flex)`
  position: absolute;
  bottom: 100%;
  margin-bottom: -1px;
`;

const CloseButton = styled(Button)`
  display: flex;
  padding: 16px 0;
`;

const InlineModal = ({
  width,
  links,
  children,
  hidden,
  onClose,
}) => (
  <Wrapper hidden={false}>
    <Container>
      <CaretContainer>
        <Icon icon="caret" height={10} />
      </CaretContainer>
      <Content>
        {children}
      </Content>
      <Icon icon="x" height={14} onClick={onClose} />
    </Container>
  </Wrapper>
);

InlineModal.defaultProps = {
  caretPos: 0,
  onClose: () => {},
};

InlineModal.propTypes = {
  width: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  })),
  onClose: PropTypes.func,
};

export default InlineModal;
