import React from 'react';
import useAuth from '../context/useAuth';
import LoadingSpinner from './LoadingSpinner';
import useRole from '../hooks/useRole';
import Forbidden from './Forbidden/Forbidden';

const AdminRoute = ({ children }) => {
  const { loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <LoadingSpinner />;
  }

  if (role !== 'admin') {
    return <Forbidden />;
  }

  return children;
};

export default AdminRoute;