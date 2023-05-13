import {
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';
import styled from 'styled-components';

import Flex from '../../components/atoms/Flex';
import Header from '../../containers/Header';

import ListView from './Form';

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

const SignInPage = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<ListView />} />
      </Route>
    </Routes>
  );
};

export default SignInPage;
