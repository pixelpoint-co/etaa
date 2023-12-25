import {
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';
import styled from 'styled-components';

import { palette } from 'styled-theme';
import Flex from '../../components/atoms/Flex';
import Header from '../../containers/Header';
import Main from './Main';

const PageWrapper = styled(Flex)`
  flex-direction: column;
  max-width: 100%;
  background: white;
  background: ${palette(
    'grayscale',
    6,
  )};
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
        <Route path="/" index element={<Main />} />
      </Route>
    </Routes>
  );
};

export default RecipePage;
