import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles = [], requireAcceptance = false }) => {
  const { auth } = useAuth();
  const location = useLocation();
  
  const isAuthenticated = auth?.accessToken && auth?.email;
  const hasRequiredRole = allowedRoles.length === 0 || 
    (auth?.role && allowedRoles.includes(auth.role));
  
  console.log(`Authentication check: ${isAuthenticated}`);
  console.log(`Role check: ${hasRequiredRole}`);
  console.log(`User role: ${auth?.role}`);
  console.log(`Allowed roles:`, allowedRoles);
  console.log(`Accepter status: ${auth?.accepter}`);
  console.log(`Require acceptance: ${requireAcceptance}`);
  
  // If not authenticated, redirect to appropriate login page
  if (!isAuthenticated) {
    // Redirect teachers/admins to teacher login, students to student login
    const redirectPath = allowedRoles.includes('teacher') || allowedRoles.includes('admin') 
      ? "/teacherLogin" 
      : "/login";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If user doesn't have the required role
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Special handling for students who need acceptance
  if (requireAcceptance && auth?.role === 'student' && !auth?.accepter) {
    return <Navigate to="/student/waiting" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;