import {
  Route,
  Routes,
  Outlet,
  Navigate,
} from 'react-router-dom';
import styled from 'styled-components';

import Flex from '../../components/atoms/Flex';

import Main from './Main';

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

const PotControllerPage = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path=":id" index element={<Main />} />
        {/* <Route
          path="*"
          element={() => <Navigate to="/1" replace />}
        /> */}
      </Route>
    </Routes>
  );
};

export default PotControllerPage;
