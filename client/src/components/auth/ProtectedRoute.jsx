import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase/firebase';
import Loader from '../ui/Loader';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  if (!user) {
    // Brief window right after login: token or Firebase session exists
    // but AuthContext hasn't finished setting user state yet — show loader
    const hasJwtToken = !!localStorage.getItem('vdort_token');
    const hasFirebaseSession = !!auth.currentUser;
    if (hasJwtToken || hasFirebaseSession) return <Loader fullScreen />;

    // Truly not logged in → homepage
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role → redirect to correct portal
  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'client') return <Navigate to="/client" replace />;
    if (user.role === 'student') return <Navigate to="/student" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
