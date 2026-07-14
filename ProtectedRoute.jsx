import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  ProtectedRoute
  - checks user login
  - protects private pages
*/

function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Wait until auth is loaded
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in
  return <Outlet />;
}

export default ProtectedRoute;