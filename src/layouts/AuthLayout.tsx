import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
