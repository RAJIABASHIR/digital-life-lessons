import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const AdminRoute = ({ children }) => {
  const { loading, appUser } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!appUser || appUser.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default AdminRoute;