import {
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';
import styled from 'styled-components';

import Flex from '../../components/atoms/Flex';

import EditView from './EditView';
import ListView from './ListView';
import Dashboard from './Dashboard';

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

const StoragePage = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/list" element={<ListView />} />
        <Route path="/edit/:id" element={<EditView />} />
      </Route>
    </Routes>
  );
};

export default StoragePage;
