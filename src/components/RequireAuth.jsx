import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles = [] }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const isAuthenticated = auth?.accessToken && auth?.email;
  const hasRequiredRole = allowedRoles.length === 0 || 
    (auth?.role && allowedRoles.includes(auth.role));
  console.log(`auuuuuthhhh ${isAuthenticated}`)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default RequireAuth;