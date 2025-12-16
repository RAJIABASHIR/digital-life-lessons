import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { firebaseUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;