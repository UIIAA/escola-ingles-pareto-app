import { useAuth } from '@/contexts/AuthContext';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Get user role from auth context
  const userRole = user?.user_metadata?.role || 'student';

  // Render the appropriate dashboard based on user role
  switch (userRole) {
    case 'teacher':
      return <TeacherDashboard />;
    case 'master':
      return <AdminDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
};

export default Dashboard;