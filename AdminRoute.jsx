import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const { user, loading } = useAuth();

  // Wait until auth is loaded
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Not an admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin
  return <Outlet />;
}

export default AdminRoute;