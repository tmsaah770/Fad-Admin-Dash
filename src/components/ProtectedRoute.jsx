import { Navigate, useLocation, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute Guard
 * Strictly enforces that only authenticated users with a valid token can access the dashboard.
 * If not authenticated, redirects directly to /login.
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem('parkly_token');

  // Strictly disallow missing tokens or old mock tokens
  if (!token || token === 'demo_admin_jwt_token') {
    localStorage.removeItem('parkly_token');
    localStorage.removeItem('parkly_user');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
