import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import Dashboard from '@/pages/Dashboard';
import SupplierInvitePage from '@/pages/supplier/invited-supplier';
import NotFound from '@/pages/NotFound';

const AppRoutes: React.FC = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'supplier/invited-supplier', element: <SupplierInvitePage /> }
      ]
    },
    { path: '*', element: <NotFound /> }
  ]);

  return element;
};

export default AppRoutes;
