import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TemplateListPage from '@/pages/TemplateListPage';
import TemplateDetailPage from '@/pages/TemplateDetailPage';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/template" replace />} />
    <Route path="/template" element={<TemplateListPage />} />
    <Route path="/template/detail" element={<TemplateDetailPage />} />
  </Routes>
);

export default AppRoutes;
