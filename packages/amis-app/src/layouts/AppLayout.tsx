import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <header className="app-layout__header">
        <div className="app-layout__brand">AMis 管理平台</div>
        <nav className="app-layout__nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            仪表盘
          </NavLink>
        </nav>
      </header>
      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
