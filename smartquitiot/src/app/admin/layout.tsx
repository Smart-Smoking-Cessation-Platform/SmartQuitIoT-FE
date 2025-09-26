"use client"
import { ConfigProvider, Layout, Menu, Avatar, Typography, Space } from "antd"
import { MenuOutlined, UserOutlined, BookOutlined, AimOutlined, TrophyOutlined, StarOutlined, TeamOutlined, DollarOutlined } from "@ant-design/icons"
import Link from "next/link";
import React from "react";

const { Header, Sider, Content } = Layout
const { Title } = Typography

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#7AC555', fontFamily: 'Poppins, sans-serif' } }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={250} theme="light">
            <div style={{ padding: '24px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>Ant Design</div>
            <Menu mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1" icon={<MenuOutlined />}>
                <Link href="/admin">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<BookOutlined />}>
                <Link href="/admin/blogs">Manage Blogs</Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<AimOutlined />}>
                <Link href="/admin/missions">Manage Mission</Link>
              </Menu.Item>
              <Menu.Item key="4" icon={<TrophyOutlined />}>
                <Link href="/admin/badges">Manage Badges</Link>
              </Menu.Item>
              <Menu.Item key="5" icon={<StarOutlined />}>
                <Link href="/admin/achievements">Manage Achievement</Link>
              </Menu.Item>
              <Menu.Item key="6" icon={<TeamOutlined />}>
                <Link href="/admin/accounts">Manage Account</Link>
              </Menu.Item>
              <Menu.Item key="7" icon={<DollarOutlined />}>
                <Link href="/admin/membership-packages">Membership Packages</Link>
              </Menu.Item>
               <Menu.Item key="8" icon={<UserOutlined />}>
                <Link href="/admin/members">Manage Members</Link>
              </Menu.Item>
            </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Title level={4} style={{ margin: 0 }}>Ant Design</Title>
            <Space><Avatar icon={<UserOutlined />} /><span>Profile</span></Space>
          </Header>
          <Content style={{ padding: 24, background: '#f0f2f5', overflowY: 'auto' }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
