import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Participantes from '../pages/Participantes';
import Pagos from '../pages/Pagos';
import Kits from '../pages/Kits';
import Preventa from '../pages/Preventa';
import Reportes from '../pages/Reportes';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard"     element={<Dashboard />} />
      <Route path="/participantes" element={<Participantes />} />
      <Route path="/pagos"         element={<Pagos />} />
      <Route path="/kits"          element={<Kits />} />
      <Route path="/preventa"      element={<Preventa />} />
      <Route path="/reportes"      element={<Reportes />} />
      <Route path="*"              element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
