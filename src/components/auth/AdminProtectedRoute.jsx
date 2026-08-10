import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
  // Simulating authentication check. 
  // Once RTK is fully integrated, you will select the auth state from the Redux store here.
  const isAdminLoggedIn = localStorage.getItem("adminToken") === "true";
  
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
