"use client";
import React, { useState } from "react";
import { Table, Tag, Button, Space, Card, message, Progress } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteConfirmModal from "@/components/modals/common/delete-confirm-modal";
import MissionModal from "@/components/modals/missions/mission-modal";
import MissionDetail from "@/components/admin/missions/mission-detail";
import { ExtendedMission } from "@/types/extended-mission";

const mockMissions: ExtendedMission[] = [
  {
    id: 1,
    title: "Reduce Cigarettes",
    description: "Cut down to 5 cigarettes per day",
    difficulty: "Easy",
    status: "Active",
    rewardPoints: 50,
    category: "Daily",
    startDate: "2025-09-01",
    endDate: "2025-09-07",
    completionRate: 70,
  },
  {
    id: 2,
    title: "No Smoking Day",
    description: "Abstain from smoking for one day",
    difficulty: "Medium",
    status: "Active",
    rewardPoints: 100,
    category: "Challenge",
    startDate: "2025-09-05",
    endDate: "2025-09-05",
    completionRate: 40,
  },
  {
    id: 3,
    title: "Week Smoke-Free",
    description: "Stay smoke-free for 7 days",
    difficulty: "Hard",
    status: "Inactive",
    rewardPoints: 200,
    category: "Weekly",
    startDate: "2025-08-20",
    endDate: "2025-08-27",
    completionRate: 100,
  },
];

export default function MissionsPage() {
  const [missions, setMissions] = useState<ExtendedMission[]>(mockMissions);

  // Modal add/edit
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingMission, setEditingMission] = useState<ExtendedMission | null>(
    null
  );

  // Modal delete
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingMission, setDeletingMission] =
    useState<ExtendedMission | null>(null);

  // Detail page style
  const [selectedMission, setSelectedMission] = useState<ExtendedMission | null>(
    null
  );

  const [messageApi, contextHolder] = message.useMessage();

  // handle functions
  const handleView = (mission: ExtendedMission) => {
    setSelectedMission(mission);
  };

  const handleBack = () => {
    setSelectedMission(null);
  };

  const handleEdit = (mission: ExtendedMission) => {
    setEditingMission(mission);
    setModalMode("edit");
    setModalVisible(true);
  };

  const handleDelete = (mission: ExtendedMission) => {
    setDeletingMission(mission);
    setDeleteModalVisible(true);
  };

  // table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center" as const,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "center" as const,
      render: (text: string) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      align: "center" as const,
      render: (text: string) => (
        <Tag
          color={
            text === "Easy" ? "green" : text === "Medium" ? "orange" : "red"
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (text: string) => (
        <Tag color={text === "Active" ? "blue" : "default"}>{text}</Tag>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      align: "center" as const,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      align: "center" as const,
    },
    {
      title: "Reward Points",
      dataIndex: "rewardPoints",
      key: "rewardPoints",
      align: "center" as const,
    },
    {
      title: "Completion",
      dataIndex: "completionRate",
      key: "completionRate",
      align: "center" as const,
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          status={rate === 100 ? "success" : "active"}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center" as const,
      render: (_, record: ExtendedMission) => (
        <Space style={{ justifyContent: "center" }}>
          <Button type="link" onClick={() => handleView(record)}>
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

  // Nếu có selectedMission thì hiển thị trang chi tiết
  if (selectedMission) {
    // ✅ Đúng prop: mission thay vì member
    return <MissionDetail mission={selectedMission} onBack={handleBack} />;
  }

  return (
    <>
      {contextHolder}
      <Card
        title="Mission Management"
        extra={
          <Button
            type="primary"
            onClick={() => {
              setModalMode("add");
              setModalVisible(true);
            }}
          >
            Add New Mission
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={missions}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} missions`,
          }}
        />
      </Card>

      {/* Modal thêm / sửa */}
      <MissionModal
        mode={modalMode}
        visible={modalVisible}
        mission={modalMode === "edit" ? editingMission : undefined}
        onCancel={() => setModalVisible(false)}
        onSave={(mission: ExtendedMission) => {
          if (modalMode === "add") {
            setMissions((prev) => [...prev, mission]);
            messageApi.success("Mission added successfully");
          } else {
            setMissions((prev) =>
              prev.map((m) => (m.id === mission.id ? mission : m))
            );
            messageApi.success("Mission updated successfully");
          }
          setModalVisible(false);
          setEditingMission(null);
        }}
      />

      {/* Modal xoá */}
      <DeleteConfirmModal
        visible={deleteModalVisible}
        content={`Are you sure you want to delete mission "${deletingMission?.title}"?`}
        onConfirm={() => {
          if (deletingMission) {
            setMissions((prev) =>
              prev.filter((m) => m.id !== deletingMission.id)
            );
            messageApi.success({
              content: `Mission "${deletingMission.title}" deleted successfully`,
              duration: 2,
            });
          }
          setDeleteModalVisible(false);
          setDeletingMission(null);
        }}
        onCancel={() => {
          setDeleteModalVisible(false);
          setDeletingMission(null);
        }}
      />
    </>
  );
}
