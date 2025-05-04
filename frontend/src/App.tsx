import AuthPage from './pages/AuthPage';
import { Route, Routes } from 'react-router'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import ProtectedRoute from './middleware/ProtectedRoute.tsx';
import DashboardLayout from './pages/Dashboard/DashboardLayout.tsx';
import Products from './pages/Products/Products.tsx';
import InsightsPage from './pages/Products/InsightsPage.tsx';

function App() {
  return (
    <Routes>
      <Route index path='/authpage' element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<DashboardLayout />} >
          <Route path='/' element={<Dashboard />}>
            <Route index element={<InsightsPage />} />
            <Route path='/products-database' element={<Products />} />
            <Route path='/dashboard-analytics' element={<InsightsPage />} />
          </Route>
        </ Route>
      </Route>
    </Routes>
  );
}

export default App;
