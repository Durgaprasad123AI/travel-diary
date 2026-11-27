/**
 * components/AdminRoute.jsx
 * Wraps all admin pages. Only users with role === 'admin' may pass;
 * everyone else is sent to the Admin Login page.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

export default AdminRoute;
