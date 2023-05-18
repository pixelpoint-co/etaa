import PropTypes from 'prop-types';
import styled, {
  css,
} from 'styled-components';
import startCase from 'lodash/startCase';
import {
  palette,
} from 'styled-theme';
import {
  ifProp,
  ifNotProp,
} from 'styled-tools';

import Link from '../../atoms/Link';
import Icon from '../../atoms/Icon';
import Flex from '../../atoms/Flex';
import IconButton from '../IconButton/index';
import {
  unsetStyle,
} from '../../atoms/Button';

const Wrapper = styled.div`
  transition: width 200ms ease-in-out;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${palette(
    'grayscale',
    0,
  )};
  align-items: flex-start;
  overflow-y: auto;
  z-index: 2;

  width: ${({
    width,
    open,
  }) => {
    return open ? width : 80;
  }};
`;

const MenuWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 48px;
  width: 100%;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
    padding: 0;
  }
`;

const LogoSection = styled(Flex)`
  padding: 15px 10px;
  flex: 0;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 4px;
  ${ifProp(
    'open',
    css`
      margin-top: 4px;
    `,
  )}

`;

const LogoWrapper = styled(Link)`
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0;
  flex-wrap: nowrap;
  transition: padding 250ms ease-in-out;

  > span {
    transition: width 250ms ease-in-out;
  }
  ${ifProp(
    'open',
    css`
      padding: 5px;
    `,
  )}
`;

const MenuLink = styled(Link)`
  display: flex;
  font-size: 22px;
  line-height: 22px;
  color: ${palette(
    'white',
    0,
  )};
  margin: 5px;
  padding: 14px;
  border-radius: 10px;
  &.active,
  &:hover,
  &:focus {
    background-color: ${palette(
    'grayscale',
    1,
  )};
    color: ${palette(
    'white',
    0,
  )};
    text-decoration: none;
  }

  > span {
    transition: width 250ms ease-in-out;
    text-align: center;
    white-space: nowrap;
    width: 0px;
  }

  ${ifNotProp(
    'open',
    css`
      padding: 8px 6px;
      font-size: 16px;
      > span {
        width: 100%;
      }
    `,
  )}
`;

const DrawerContainer = styled.button`
  ${unsetStyle};
  padding: 5px;
  margin: 5px;
  margin-left: auto;
  margin-right: auto;
  transition: margin 250ms ease-in-out;

  ${ifProp(
    'open',
    css`
      margin-right: 0px;
      margin-left: auto;
    `,
  )}
`;

const LogoO = styled(Icon)`

`;

const LeftMenu = ({
  width,
  links,
  onClose,
  onOpen,
  open,
}) => (
  <Wrapper width={width} open={open}>
    <LogoSection open={open}>
      <LogoWrapper to="/" open={open}>
        <Icon icon="logoCre" width={open ? 58 : 0} height={24} fill="white" />
        <LogoO icon="logoO" width={open ? 63 : 50} height={24} fill="white" open={open} />
      </LogoWrapper>
      <DrawerContainer
        onClick={() => {
          if (open) {
            return onClose();
          }
          return onOpen();
        }}
      >
        <Icon
          icon="drawer"
          size={20}
          fill="white"
          transparent
          rotateDeg={open ? 0 : 180}
        />
      </DrawerContainer>
    </LogoSection>
    <MenuWrapper>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <MenuLink
              open={open}
              to={link.href.replace(
                '/*',
                '',
              )}
              label={link.label}
            >
              <span>
                {startCase(link.label)}
              </span>
            </MenuLink>
          </li>
        ))}
      </ul>
      <MenuLink
        to="/"
        style={{
          // height: 'auto',
          // alignSelf: 'flex-end',
        }}
        onClick={() => { onClose(); }}
      >Log Out
      </MenuLink>
    </MenuWrapper>
  </Wrapper>
);

LeftMenu.defaultProps = {
  width: '220',
  links: [{
    label: 'Home',
    href: '/',
  }],
  onClose: () => {},
};

LeftMenu.propTypes = {
  width: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  })),
  onClose: PropTypes.func,
};

export default LeftMenu;
