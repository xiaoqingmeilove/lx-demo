import React, { useMemo, useState } from 'react';
import { App as AntdApp, ConfigProvider, Layout, Menu, theme, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';
import AppRoutes from '@/router';
import { useAppContext } from '@/contexts/AppContext';
import type { MenuItem } from '@/types/app';

const { Header, Sider, Content } = Layout;

const mapMenusToItems = (menus: MenuItem[]): MenuProps['items'] =>
  menus.map((menu) => ({
    key: menu.path,
    label: menu.title,
    children: menu.children?.length ? mapMenusToItems(menu.children) : undefined,
  }));

const Shell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { menus, userInfo, findMenuByPath } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);

  const items = useMemo(() => mapMenusToItems(menus), [menus]);

  const handleMenuClick: MenuProps['onClick'] = (info) => {
    navigate(info.key);
  };

  const currentMenu = findMenuByPath(location.pathname);

  return (
    <Layout className="app-layout">
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={220} breakpoint="lg">
        <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>
          LX 平台
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingInline: 24,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            {currentMenu?.title ?? '工作台'}
          </Typography.Title>
          <Typography.Text>您好，{userInfo?.name ?? '访客'}</Typography.Text>
        </Header>
        <Content>
          <AppRoutes />
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN} theme={{ algorithm: theme.defaultAlgorithm }}>
      <AntdApp>
        <Shell />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
