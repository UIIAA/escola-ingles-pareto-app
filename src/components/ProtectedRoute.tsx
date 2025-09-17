import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'teacher' | 'master';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login with return URL
      navigate('/login', {
        state: { from: location.pathname },
        replace: true
      });
    }
  }, [user, loading, navigate, location]);

  useEffect(() => {
    if (user && requiredRole) {
      const userRole = user.user_metadata?.role || 'student';

      // Check if user has required role
      if (userRole !== requiredRole && userRole !== 'master') {
        // Redirect to appropriate dashboard based on user role
        switch (userRole) {
          case 'student':
            navigate('/dashboard', { replace: true });
            break;
          case 'teacher':
            navigate('/teaching', { replace: true });
            break;
          default:
            navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [user, requiredRole, navigate]);

  // Show loading skeleton while checking authentication
  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // If user is not authenticated, return null (redirect will happen in useEffect)
  if (!user) {
    return null;
  }

  // If user doesn't have required role, return null (redirect will happen in useEffect)
  if (requiredRole) {
    const userRole = user.user_metadata?.role || 'student';
    if (userRole !== requiredRole && userRole !== 'master') {
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;