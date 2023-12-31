import {
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';
import {
  palette, size,
} from 'styled-theme';
import {
  useSelector,
} from 'react-redux';
import {
  ifProp,
} from 'styled-tools';
import styled, {
  css,
} from 'styled-components';

import {
  ToastContainer,
} from 'react-toastify';

import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import Inventory from '../pages/Inventory';
import Product from '../pages/Product';
import Purchase from '../pages/Purchase';
import SignIn from '../pages/SignIn';
import Storage from '../pages/Storage';
import Recipe from '../pages/Recipe';
import Billy from '../pages/Billy';
import ControlTower from '../pages/ControlTower';
import Gates from '../pages/Gates';
import Playground from '../pages/Playground';
import DevMode from '../pages/DevMode';

import LeftMenu from '../containers/LeftMenu';
import Header from '../containers/Header';

import Flex from '../components/atoms/Flex';

const routes = [
  // {
  //   label: '발주',
  //   href: '/purchase/*',
  //   element: <Purchase />,
  //   rootRoute: true,
  // },
  // {
  //   label: '입고',
  //   href: '/storage/*',
  //   element: <Storage />,
  //   rootRoute: true,
  // },

  // {
  //   label: '재고관리',
  //   href: '/inventory/*',
  //   element: <Inventory />,
  //   rootRoute: true,
  // },
  // {
  //   label: '자재',
  //   href: '/product/*',
  //   element: <Product />,
  //   rootRoute: true,
  // },
  // {
  //   label: '레시피',
  //   href: '/recipe/*',
  //   element: <Recipe />,
  //   rootRoute: true,
  // },
  {
    label: '팟',
    href: '/billy/*',
    element: <Billy />,
    rootRoute: true,
  },
  // {
  //   label: '개발모드',
  //   href: '/pot-controller',
  //   element: <DevMode />,
  //   rootRoute: true,
  // },
  {
    label: '관제',
    href: '/order-monitor/*',
    rootRoute: true,
  },
  {
    label: '놀이터',
    href: '/playground/*',
    element: <Playground />,
    // rootRoute: true,
  },
  // {
  //   label: '자재관리',
  //   href: '/inventory/:id',
  //   element: <Inventory />,
  //   rootRoute: true,
  // },
];

const Wrapper = styled(Flex)`
  flex-direction: row;
  flex-grow: 1;
  background: ${palette(
    'grayscale',
    5,
  )};
  box-shadow: rgba(50, 50, 93, 0.1) 0px 2px 4px;
  height: 100%;
  overflow: auto;
`;

const PageWrapper = styled(Flex)`
  transition: padding 250ms ease-in-out;
  flex-grow: 1;
  max-width: 100vw;

  padding-left: calc(80px);

  ${ifProp(
    'leftMenuOpen',
    css`
      padding-left: calc(220px);
    `,
  )}
  /* padding-top: 50px; */
  @media (max-width: ${size('mobileBreakpoint')}){
  }
`;
// const PageWrapper = styled(Flex)`
//   padding-left: calc(250px);
//   max-width: 100vw;
//   padding-right: ${size('padding.default')};
//   flex-grow: 1;
//   height: calc(100% - 40px);

//   @media (max-width: ${size('mobileBreakpoint')}){
//     padding-left: 0px;
//     padding-right: 0px;
//     padding-top: 50px;
//     height: calc(100% - 60px);
//   }
// `;

const Layout = () => {
  const leftMenuOpen = useSelector((state) => state.leftMenu.open);
  return (
    <Wrapper>
      <LeftMenu links={routes.filter((v) => v.rootRoute)} open={leftMenuOpen} />
      <PageWrapper
        leftMenuOpen={leftMenuOpen}
      >

        <Outlet />

      </PageWrapper>
    </Wrapper>
  );
};

const App = () => (
  <Wrapper>
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/gates/*" element={<Gates />} />
      <Route path="/order-monitor/*" element={<ControlTower />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Billy />} />
        {routes.map((route) => {
          const isInternal = route.href[0] === '/';
          if (!isInternal) return null;
          return (
            <Route key={route.href} path={route.href} element={route.element} />
          );
        })}
        {/* 404 */}
        <Route path="*" component={NotFound} />
      </Route>
    </Routes>
    <ToastContainer />
  </Wrapper>
);

export default App;
