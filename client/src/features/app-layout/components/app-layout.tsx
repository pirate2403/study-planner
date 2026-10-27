import { Flex, Layout, Menu, Typography } from 'antd';
import { Link, Outlet, useLocation } from 'react-router';

const { Content, Header } = Layout;

const navigationItems = [
  { key: 'tasks', label: <Link to="/">Задачи</Link> },
  { key: 'subjects', label: <Link to="/subjects">Предметы</Link> },
];

export const AppLayout = () => {
  const { pathname } = useLocation();
  const selectedKey = pathname === '/subjects' ? 'subjects' : 'tasks';

  return (
    <Layout style={{ minHeight: '100dvh' }}>
      <Header style={{ alignItems: 'center', display: 'flex', gap: 32 }}>
        <Typography.Text strong style={{ color: '#fff', fontSize: 17 }}>
          Учебный планировщик
        </Typography.Text>
        <Menu
          items={navigationItems}
          mode="horizontal"
          selectedKeys={[selectedKey]}
          style={{ flex: 1, minWidth: 0 }}
          theme="dark"
        />
      </Header>
      <Content
        style={{
          maxWidth: 1200,
          padding: '40px 24px',
          width: '100%',
        }}
      >
        <Flex vertical>
          <Outlet />
        </Flex>
      </Content>
    </Layout>
  );
};
