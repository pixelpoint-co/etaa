import {
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';
import styled from 'styled-components';

import Flex from '../../components/atoms/Flex';
import Header from '../../containers/Header';
import Main from './Main';

const PageWrapper = styled(Flex)`
  flex-direction: column;
`;

const Layout = () => (
  <PageWrapper>
    <Outlet />
  </PageWrapper>
);

const RecipePage = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route path="/" index element={<Main />} />
    </Route>
  </Routes>
);

export default RecipePage;
