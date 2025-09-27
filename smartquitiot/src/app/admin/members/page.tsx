"use client";
import React, { useState } from "react";
import { Table, Avatar, Tag, Button, Space, Card, Modal, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import MemberDetail from "@/components/admin/members/member-detail";
import MemberModal from "@/components/modals/members/member-modal";
import DeleteConfirmModal from "@/components/modals/common/delete-confirm-modal";
import { Member } from "@/types/member";
import type { ColumnsType } from "antd/es/table";

// ---------------- Mock Data ----------------
const mockMembers: Member[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1234567890",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    joinDate: "01/15/2023",
    position: "Senior Developer",
    address: "123 Main Street, New York, NY",
    dateOfBirth: "05/20/1990",
    salary: 85000,
    experience: "5 years",
    quitStatus: "Quitting",
    cigarettesPerDay: 5,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1234567891",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    joinDate: "08/10/2022",
    position: "Marketing Manager",
    address: "456 Oak Avenue, Los Angeles, CA",
    dateOfBirth: "12/15/1988",
    salary: 75000,
    experience: "7 years",
    quitStatus: "Not Started",
    cigarettesPerDay: 10,
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1234567892",
    status: "Inactive",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    joinDate: "03/22/2023",
    position: "HR Specialist",
    address: "789 Pine Road, Chicago, IL",
    dateOfBirth: "07/08/1992",
    salary: 60000,
    experience: "3 years",
    quitStatus: "Quit",
    cigarettesPerDay: 0,
  },
];

// ---------------- Component ----------------
export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // ---------------- Table Columns ----------------
  const columns: ColumnsType<Member> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
    },
    {
      title: "Member",
      key: "member",
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <span>{record.name}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Quit Status",
      dataIndex: "quitStatus",
      key: "quitStatus",
      align: "center",
      render: (text: string) => (
        <Tag
          color={
            text === "Quitting" ? "orange" : text === "Quit" ? "green" : "red"
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Cigarettes / Day",
      dataIndex: "cigarettesPerDay",
      key: "cigarettesPerDay",
      align: "center",
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
  const handleViewDetail = (member: Member) => {
    setSelectedMember(member);
    setViewMode("detail");
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setModalMode("edit");
    setModalVisible(true);
  };

  const handleDelete = (member: Member) => {
    setDeletingMember(member);
    setDeleteModalVisible(true);
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedMember(null);
  };

  // ---------------- Render ----------------
  if (viewMode === "detail" && selectedMember) {
    return <MemberDetail member={selectedMember} onBack={handleBackToList} />;
  }

  return (
    <>
      {contextHolder}
      <div>
        <Card
          title="Member Management"
          extra={
            <Button
              type="primary"
              onClick={() => {
                setModalMode("add");
                setModalVisible(true);
              }}
            >
              Add New Member
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={members}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} members`,
            }}
          />
        </Card>

        {/* Modal dùng chung cho Add/Edit */}
        <MemberModal
          mode={modalMode}
          visible={modalVisible}
          member={modalMode === "edit" ? editingMember : undefined}
          onCancel={() => setModalVisible(false)}
          onSave={(member) => {
            if (modalMode === "add") {
              setMembers((prev) => [...prev, member]);
            } else {
              setMembers((prev) =>
                prev.map((m) => (m.id === member.id ? member : m))
              );
            }
            setModalVisible(false);
            setEditingMember(null);
          }}
        />

        <DeleteConfirmModal
          visible={deleteModalVisible}
          content={`Are you sure you want to delete member "${deletingMember?.name}"?`}
          onConfirm={() => {
            if (deletingMember) {
              setMembers((prev) =>
                prev.filter((m) => m.id !== deletingMember.id)
              );
              messageApi.success({
                content: `Member "${deletingMember.name}" deleted successfully`,
                duration: 2,
              });
            }
            setDeleteModalVisible(false);
            setDeletingMember(null);
          }}
          onCancel={() => {
            setDeleteModalVisible(false);
            setDeletingMember(null);
          }}
        />
      </div>
    </>
  );
}
