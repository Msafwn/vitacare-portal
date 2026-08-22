import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/features/users/userApiSlice";

export default function AdminProtectedRoute() {
  const { data: response, isLoading } = useGetCurrentUserQuery();
  const user = response?.data;
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
