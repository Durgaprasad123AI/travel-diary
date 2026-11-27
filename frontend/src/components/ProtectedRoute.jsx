/**
 * components/ProtectedRoute.jsx
 * Wraps all user pages. If there is no logged-in user, redirect to /login.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
