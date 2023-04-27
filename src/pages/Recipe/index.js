import {
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';
import styled from 'styled-components';

import Flex from '../../components/atoms/Flex';
import Header from '../../containers/Header';

import TreeView from './TreeView';

const PageWrapper = styled(Flex)`
  flex-direction: column;
`;

const Layout = () => {
  return (
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  );
};

const RecipePage = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/tree" element={<TreeView />} />
      </Route>
    </Routes>
  );
};

export default RecipePage;
