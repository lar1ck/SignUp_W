import AuthPage from './pages/AuthPage';
import { Route, Routes } from 'react-router'
import Dashboard from './pages/Dashboard.tsx'
import ProtectedRoute from './middleware/ProtectedRoute.tsx';

function App() {
  return (
    <Routes>
      <Route index path='/authpage' element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
