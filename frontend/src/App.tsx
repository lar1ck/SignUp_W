import AuthPage from './pages/AuthPage';
import { Route, Routes } from 'react-router'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import ProtectedRoute from './middleware/ProtectedRoute.tsx';
import DashboardLayout from './pages/Dashboard/DashboardLayout.tsx';
import Products from './pages/Products/Products.tsx';
import ManageProducts from './pages/Products/ManageProducts.tsx';

function App() {
  return (
    <Routes>
      <Route index path='/authpage' element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<DashboardLayout />} >
          <Route path='/' element={<Dashboard />}>
            <Route index element={<Products />} />
            <Route path='/products-database' element={<Products />} />
            <Route path='/view-products' element={<ManageProducts />} />
          </Route>
        </ Route>
      </Route>
    </Routes>
  );
}

export default App;
