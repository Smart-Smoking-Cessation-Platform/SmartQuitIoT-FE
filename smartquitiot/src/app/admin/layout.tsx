"use client";

import { useState, useEffect } from "react";
import { ConfigProvider, Layout, Menu, Avatar, Space, Skeleton } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  BookOutlined,
  AimOutlined,
  TrophyOutlined,
  StarOutlined,
  TeamOutlined,
  DollarOutlined,
  FileOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo/logo.png";

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: "1", icon: <MenuOutlined />, label: <Link href="/admin">Dashboard</Link> },
  { key: "2", icon: <BookOutlined />, label: <Link href="/admin/blogs">Manage Blogs</Link> },
  { key: "3", icon: <AimOutlined />, label: <Link href="/admin/missions">Manage Missions</Link> },
  { key: "4", icon: <TrophyOutlined />, label: <Link href="/admin/badges">Manage Badges</Link> },
  { key: "5", icon: <StarOutlined />, label: <Link href="/admin/achievements">Manage Achievement</Link> },
  { key: "6", icon: <TeamOutlined />, label: <Link href="/admin/accounts">Manage Account</Link> },
  { key: "7", icon: <DollarOutlined />, label: <Link href="/admin/membership-packages">Membership Packages</Link> },
  { key: "8", icon: <UserOutlined />, label: <Link href="/admin/members">Manage Members</Link> },
  { key: "9", icon: <FileOutlined />, label: <Link href="/admin/posts">Manage Post</Link> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100); // Delay render chính
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <Skeleton active paragraph={{ rows: 20 }} />;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7AC555",
          fontFamily: "Poppins, sans-serif",
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider width={250} theme="light">
          <div
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Image src={logo} alt="Logo" width={80} style={{ height: "auto" }} priority />
          </div>

          <Menu mode="inline" defaultSelectedKeys={["1"]} items={menuItems} />
        </Sider>

        <Layout>
          <Header
            style={{
              background: "#fff",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "#7AC555", fontWeight: 600, fontSize: 18 }}>SmartQuitIot</span>
            <Space>
              <Avatar icon={<UserOutlined />} />
              <span>Profile</span>
            </Space>
          </Header>

          <Content
            style={{
              padding: 24,
              background: "#f0f2f5",
              overflowY: "auto",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
