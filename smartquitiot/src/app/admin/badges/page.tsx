"use client";
import React, { useState } from "react";
import { Table, Avatar, Tag, Button, Space, Card, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import DeleteConfirmModal from "@/components/modals/common/delete-confirm-modal";
import BadgeModal from "@/components/modals/badge/badge-modal";
import {Badge} from "@/types/badge";
import type { ColumnsType } from "antd/es/table";
import BadgeDetail from "@/components/admin/badge/badge-detail";


// ---------------- Mock Data ----------------
const mockBadges: Badge[] = [
  {
    id: 1,
    name: "First Week Smoke-Free",
    description: "Awarded after 7 days smoke-free",
    icon: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    points: 50,
    status: "Active",
  },
  {
    id: 2,
    name: "One Month Champion",
    description: "Awarded after 30 days smoke-free",
    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    points: 150,
    status: "Active",
  },
  {
    id: 3,
    name: "Half Year Hero",
    description: "Awarded after 180 days smoke-free",
    icon: "https://cdn-icons-png.flaticon.com/512/616/616490.png",
    points: 500,
    status: "Inactive",
  },
];

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingBadge, setDeletingBadge] = useState<Badge | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // ---------------- Table Columns ----------------
  const columns: ColumnsType<Badge> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
    },
    {
      title: "Badge",
      key: "badge",
      render: (_, record) => (
        <Space>
          <Avatar src={record.icon} icon={<GiftOutlined />} />
          <span>{record.name}</span>
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text: string) => (
        <Tag color={text === "Active" ? "green" : "red"}>{text}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space style={{ justifyContent: "center" }}>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // ---------------- Handlers ----------------
  const handleViewDetail = (badge: Badge) => {
    setSelectedBadge(badge);
    setViewMode("detail");
  };

  const handleEdit = (badge: Badge) => {
    setEditingBadge(badge);
    setModalMode("edit");
    setModalVisible(true);
  };

  const handleDelete = (badge: Badge) => {
    setDeletingBadge(badge);
    setDeleteModalVisible(true);
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedBadge(null);
  };

  // ---------------- Render ----------------
  if (viewMode === "detail" && selectedBadge) {
    return <BadgeDetail badge={selectedBadge} onBack={handleBackToList} />;
  }

  return (
    <>
      {contextHolder}
      <Card
        title="Badges Management"
        extra={
          <Button
            type="primary"
            onClick={() => {
              setModalMode("add");
              setModalVisible(true);
            }}
          >
            Add New Badge
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={badges}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} badges`,
          }}
        />
      </Card>

      <BadgeModal
        mode={modalMode}
        visible={modalVisible}
        badge={modalMode === "edit" ? editingBadge ?? undefined : undefined}
        onCancel={() => setModalVisible(false)}
        onSave={(badge) => {
          if (modalMode === "add") {
            setBadges((prev) => [...prev, badge]);
          } else {
            setBadges((prev) =>
              prev.map((b) => (b.id === badge.id ? badge : b))
            );
          }
          setModalVisible(false);
          setEditingBadge(null);
        }}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        content={`Are you sure you want to delete badge "${deletingBadge?.name}"?`}
        onConfirm={() => {
          if (deletingBadge) {
            setBadges((prev) =>
              prev.filter((b) => b.id !== deletingBadge.id)
            );
            messageApi.success({
              content: `Badge "${deletingBadge.name}" deleted successfully`,
              duration: 2,
            });
          }
          setDeleteModalVisible(false);
          setDeletingBadge(null);
        }}
        onCancel={() => {
          setDeleteModalVisible(false);
          setDeletingBadge(null);
        }}
      />
    </>
  );
}
