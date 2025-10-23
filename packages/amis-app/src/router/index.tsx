import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';

const AppRoutes: React.FC = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <Dashboard /> }
      ]
    },
    { path: '*', element: <NotFound /> }
  ]);

  return element;
};

export default AppRoutes;
