import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BottomNav, Loading } from '@/components';

const PrivateRoute: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <Loading />;
  }

  return user ? (
    <>
      <Outlet />
      <BottomNav />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
