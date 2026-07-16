import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase/firebase';
import Loader from '../ui/Loader';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (!user) {
    const hasJwtToken = !!localStorage.getItem('vdort_token');
    const hasFirebaseSession = !!auth.currentUser;
    if (loading || hasJwtToken || hasFirebaseSession) return <Loader fullScreen />;
    return <Navigate to="/" replace />;
  }
  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'client') return <Navigate to="/client" replace />;
    if (user.role === 'student') return <Navigate to="/student" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
