import {
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';
import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';

import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import Inventory from '../pages/Inventory';
import Storage from '../pages/Storage';
import Recipe from '../pages/Recipe';
import LeftMenu from '../containers/LeftMenu';
import Header from '../containers/Header';

import Flex from '../components/atoms/Flex';

const routes = [
  {
    label: '입고',
    href: '/storage/*',
    element: <Storage />,
    rootRoute: true,
  },
  {
    label: '자재관리',
    href: '/inventory/*',
    element: <Inventory />,
    rootRoute: true,
  },
  {
    label: '레시피',
    href: '/recipe/*',
    element: <Recipe />,
    rootRoute: true,
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
  background: ${palette('grayscale', 5)};
  box-shadow: rgba(50, 50, 93, 0.1) 0px 2px 4px;
  height: 100%;
  overflow: auto;
`;

const PageWrapper = styled(Flex)`
  padding-left: calc(250px);
  max-width: 100vw;
  padding-right: ${size('padding.default')};
  flex-grow: 1;
  height: calc(100% - 40px);

  @media (max-width: ${size('mobileBreakpoint')}){
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 50px;
    height: calc(100% - 60px);
  }
`;

const Layout = () => {
  return (
    <Wrapper>
      <LeftMenu links={routes.filter((v) => v.rootRoute)} />
      <PageWrapper>

        <Outlet />

      </PageWrapper>
    </Wrapper>
  );
};

const App = () => {
  return (
    <Wrapper>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
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
    </Wrapper>
  );
};

export default App;
