import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  PictureOutlined,
  PlusOutlined,
  FolderOutlined,
  BulbOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Link, Outlet } from 'react-router';
import logo from "../../src/assets/images/logo.jpg"

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items = [
    getItem(<Link to="">Users</Link>, '1', <UserOutlined />),
    getItem(<Link to="bookings">Bookings</Link>, '2', <BookOutlined />),
    getItem('Portfolio', 'sub1', <PictureOutlined />, [
      getItem(<Link to="portfolio/view">View</Link>, '3', <FolderOutlined />),
      getItem(<Link to="portfolio/add">Add</Link>, '4', <PlusOutlined />),
    ]),
    getItem('Category', 'sub2', <FolderOutlined />, [
      getItem(<Link to="category/view">View</Link>, '5', <FolderOutlined />),
      getItem(<Link to="category/add">Add</Link>, '6', <PlusOutlined />),
    ]),
    getItem(<Link to="ideas">View Ideas</Link>, '7', <BulbOutlined />),
    getItem(<Link to="queries">View Queries</Link>, '8', <QuestionCircleOutlined />),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        collapsedWidth="0"
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          items={items}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            width: '100%',
            padding: 0,
            background: colorBgContainer,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.5rem',
          }}
        >
          Admin Dashboard
        </Header>

        <Content
          id="content-area" className="content-area"
          style={{
            margin: '16px',
            padding: '16px',
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>

        <Footer style={{ textAlign: 'center' }} className='flex w-full items-center justify-center'>
          <div className='flex gap-2 justify-center items-center'>
            <span>
              Created by EPIC MEDIA ©{new Date().getFullYear()}
            </span>
            <img src={logo} alt="logo" className='h-[30px] w-[30px] rounded-full' />
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Home;
