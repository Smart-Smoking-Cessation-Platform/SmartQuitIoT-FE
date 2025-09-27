"use client"
import { ConfigProvider, Layout, Menu, Avatar, Typography, Space } from "antd"
import {
  MenuOutlined,
  UserOutlined,
  BookOutlined,
  AimOutlined,
  TrophyOutlined,
  StarOutlined,
  TeamOutlined,
  DollarOutlined,
} from "@ant-design/icons"
import Link from "next/link"
import React from "react"

const { Header, Sider, Content } = Layout
const { Title } = Typography

// 👇 Khai báo menu items theo chuẩn mới
const menuItems = [
  {
    key: '1',
    icon: <MenuOutlined />,
    label: <Link href="/admin">Dashboard</Link>,
  },
  {
    key: '2',
    icon: <BookOutlined />,
    label: <Link href="/admin/blogs">Manage Blogs</Link>,
  },
  {
    key: '3',
    icon: <AimOutlined />,
    label: <Link href="/admin/missions">Manage Mission</Link>,
  },
  {
    key: '4',
    icon: <TrophyOutlined />,
    label: <Link href="/admin/badges">Manage Badges</Link>,
  },
  {
    key: '5',
    icon: <StarOutlined />,
    label: <Link href="/admin/achievements">Manage Achievement</Link>,
  },
  {
    key: '6',
    icon: <TeamOutlined />,
    label: <Link href="/admin/accounts">Manage Account</Link>,
  },
  {
    key: '7',
    icon: <DollarOutlined />,
    label: <Link href="/admin/membership-packages">Membership Packages</Link>,
  },
  {
    key: '8',
    icon: <UserOutlined />,
    label: <Link href="/admin/members">Manage Members</Link>,
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#7AC555',
          fontFamily: 'Poppins, sans-serif',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={250} theme="light">
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            Ant Design
          </div>
          {/* 👇 Dùng items thay vì Menu.Item */}
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              background: '#fff',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Ant Design
            </Title>
            <Space>
              <Avatar icon={<UserOutlined />} />
              <span>Profile</span>
            </Space>
          </Header>
          <Content
            style={{
              padding: 24,
              background: '#f0f2f5',
              overflowY: 'auto',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
