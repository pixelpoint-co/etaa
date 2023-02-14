import {
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';

import EditView from './EditView';
import ListView from './ListView';

const Layout = () => {
  return (
    <Outlet />
  );
};

const InventoryPage = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<ListView />} />
        <Route path="/edit/:id" element={<EditView />} />
      </Route>
    </Routes>
  );
};

export default InventoryPage;
