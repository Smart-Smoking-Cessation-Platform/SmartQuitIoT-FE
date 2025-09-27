"use client";

import React, { useState } from "react";
import { Table, Card, Space, Button, Tag, message } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteConfirmModal from "@/components/modals/common/delete-confirm-modal";
import PackageModal from "@/components/modals/packages/package-modal";
import { MembershipPackage } from "@/types/membership-package";
import type { ColumnsType } from "antd/es/table";
import PackageDetailModal from "@/components/modals/packages/package-detail-modal";

// ---------------- Mock Data ----------------
const mockPackages: MembershipPackage[] = [
  {
    id: 1,
    name: "Starter Pack",
    duration: "1 Month",
    price: 9.99,
    description: "Basic plan to get started with SmartQuit",
    status: "Active",
  },
  {
    id: 2,
    name: "Pro Pack",
    duration: "6 Months",
    price: 49.99,
    description: "Advanced support for dedicated quitters",
    status: "Active",
  },
  {
    id: 3,
    name: "Premium Pack",
    duration: "1 Year",
    price: 89.99,
    description: "Full access to all features and premium content",
    status: "Inactive",
  },
];

// ---------------- Component ----------------
export default function MembershipPackagesPage() {
  const [packages, setPackages] = useState<MembershipPackage[]>(mockPackages);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingPackage, setEditingPackage] = useState<MembershipPackage | null>(null);

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<MembershipPackage | null>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingPackage, setDeletingPackage] = useState<MembershipPackage | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  // ---------------- Handlers ----------------
  const handleView = (pkg: MembershipPackage) => {
    setSelectedPackage(pkg);
    setViewModalVisible(true);
  };

  const handleEdit = (pkg: MembershipPackage) => {
    setEditingPackage(pkg);
    setModalMode("edit");
    setModalVisible(true);
  };

  const handleSavePackage = (pkg: MembershipPackage) => {
    if (modalMode === "add") {
      setPackages((prev) => [...prev, { ...pkg, id: Date.now() }]);
      messageApi.success("Package added successfully!");
    } else {
      setPackages((prev) => prev.map((p) => (p.id === pkg.id ? pkg : p)));
      messageApi.success("Package updated successfully!");
    }
    setModalVisible(false);
    setEditingPackage(null);
  };

  const handleDelete = (pkg: MembershipPackage) => {
    setDeletingPackage(pkg);
    setDeleteModalVisible(true);
  };

  // ---------------- Table Columns ----------------
  const columns: ColumnsType<MembershipPackage> = [
    { title: "ID", dataIndex: "id", key: "id", width: 60, align: "center" },
    { title: "Package Name", dataIndex: "name", key: "name" },
    { title: "Duration", dataIndex: "duration", key: "duration", align: "center" },
    { title: "Price ($)", dataIndex: "price", key: "price", align: "center" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text: string) => <Tag color={text === "Active" ? "green" : "red"}>{text}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space style={{ justifyContent: "center" }}>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            View
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <Card
        title="Membership Packages"
        extra={
          <Button
            type="primary"
            onClick={() => {
              setModalMode("add");
              setEditingPackage(null);
              setModalVisible(true);
            }}
          >
            Add New Package
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={packages}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} packages`,
          }}
        />
      </Card>

      {/* View Modal */}
      <PackageDetailModal
        visible={viewModalVisible}
        membershipPackage={selectedPackage}
        onClose={() => setViewModalVisible(false)}
      />

      {/* Add/Edit Modal */}
      <PackageModal
        mode={modalMode}
        visible={modalVisible}
        membershipPackage={modalMode === "edit" ? (editingPackage ?? undefined) : undefined}
        onCancel={() => setModalVisible(false)}
        onSave={handleSavePackage}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        visible={deleteModalVisible}
        content={`Are you sure you want to delete package "${deletingPackage?.name}"?`}
        onConfirm={() => {
          if (deletingPackage) {
            setPackages((prev) => prev.filter((p) => p.id !== deletingPackage.id));
            messageApi.success(`Package "${deletingPackage.name}" deleted successfully`);
          }
          setDeletingPackage(null);
          setDeleteModalVisible(false);
        }}
        onCancel={() => {
          setDeletingPackage(null);
          setDeleteModalVisible(false);
        }}
      />
    </>
  );
}
