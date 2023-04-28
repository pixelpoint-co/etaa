import {
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';
import styled from 'styled-components';

import Flex from '../../components/atoms/Flex';
import Header from '../../containers/Header';

import TreeView from './TreeView';
import ListView from './ListView';

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
        <Route path="/" index element={<ListView />} />
        <Route path="/tree" element={<TreeView />} />
      </Route>
    </Routes>
  );
};

export default RecipePage;
