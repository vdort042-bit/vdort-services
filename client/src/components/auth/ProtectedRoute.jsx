import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/Loader';

const loginRoutes = {
  admin: '/admin/login',
  client: '/client/login',
  student: '/login',
};

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  if (!user) {
    return <Navigate to={loginRoutes[role] || '/login'} replace />;
  }

  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'client') return <Navigate to="/client" replace />;
    if (user.role === 'student') return <Navigate to="/student" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
