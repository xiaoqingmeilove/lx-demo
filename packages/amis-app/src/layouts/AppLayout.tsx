import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  const navLinks = [
    { to: '/dashboard', label: '仪表盘' },
    { to: '/supplier/invited-supplier', label: '供应商邀请' }
  ];

  return (
    <div className="app-layout">
      <header className="app-layout__header">
        <div className="app-layout__brand">AMis 管理平台</div>
        <nav className="app-layout__nav">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
