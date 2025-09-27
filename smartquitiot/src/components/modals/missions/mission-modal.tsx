"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Row, Col, message as antdMessage, DatePicker } from "antd";
import dayjs from "dayjs";
import { ExtendedMission } from "@/types/extended-mission";
const { Option } = Select;



interface MissionModalProps {
  mode: "add" | "edit";
  visible: boolean;
  mission?: ExtendedMission | null;
  onCancel: () => void;
  onSave: (mission: ExtendedMission) => void;
}

const MissionModal: React.FC<MissionModalProps> = ({
  mode,
  visible,
  mission,
  onCancel,
  onSave,
}) => {
  const [formData, setFormData] = useState<ExtendedMission>({
    id: Date.now(),
    title: "",
    description: "",
    difficulty: "Easy",
    status: "Active",
    rewardPoints: 0,
    category: "Daily",
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
    completionRate: 0,
  });

  const [messageApi, contextHolder] = antdMessage.useMessage();

  useEffect(() => {
    if (mode === "edit" && mission) {
      setFormData(mission);
    } else if (mode === "add") {
      setFormData({
        id: Date.now(),
        title: "",
        description: "",
        difficulty: "Easy",
        status: "Active",
        rewardPoints: 0,
        category: "Daily",
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
        completionRate: 0,
      });
    }
  }, [mode, mission]);

  const handleInputChange = <K extends keyof ExtendedMission>(
    field: K,
    value: ExtendedMission[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      messageApi.warning("Title and Description are required");
      return;
    }
    messageApi.success(mode === "add" ? "Mission added successfully" : "Mission updated successfully");
    onSave(formData);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={mode === "add" ? "Add New Mission" : "Edit Mission"}
        open={visible}
        onCancel={onCancel}
        onOk={handleSave}
        width={700}
        okText={mode === "add" ? "Add" : "Save"}
        cancelText="Cancel"
      >
        <div style={{ padding: "20px 0" }}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>Title:</label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter mission title"
              />
            </Col>
            <Col span={12}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>Category:</label>
              <Select
                style={{ width: "100%" }}
                value={formData.category}
                onChange={(value) => handleInputChange("category", value)}
              >
                <Option value="Daily">Daily</Option>
                <Option value="Weekly">Weekly</Option>
                <Option value="Challenge">Challenge</Option>
              </Select>
            </Col>
          </Row>

          <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>Description:</label>
          <Input.TextArea
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe the mission"
            style={{ marginBottom: 16 }}
          />

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>Difficulty:</label>
              <Select
                style={{ width: "100%" }}
                value={formData.difficulty}
                onChange={(value) =>
                  handleInputChange("difficulty", value as ExtendedMission["difficulty"])
                }
              >
                <Option value="Easy">Easy</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Hard">Hard</Option>
              </Select>
            </Col>
            <Col span={12}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>Status:</label>
              <Select
                style={{ width: "100%" }}
                value={formData.status}
                onChange={(value) =>
                  handleInputChange("status", value as ExtendedMission["status"])
                }
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>Start Date:</label>
              <DatePicker
                style={{ width: "100%" }}
                value={dayjs(formData.startDate)}
                onChange={(date) =>
                  handleInputChange("startDate", date ? date.format("YYYY-MM-DD") : "")
                }
              />
            </Col>
            <Col span={12}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>End Date:</label>
              <DatePicker
                style={{ width: "100%" }}
                value={dayjs(formData.endDate)}
                onChange={(date) =>
                  handleInputChange("endDate", date ? date.format("YYYY-MM-DD") : "")
                }
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>Reward Points:</label>
              <Input
                type="number"
                value={formData.rewardPoints}
                onChange={(e) =>
                  handleInputChange("rewardPoints", parseInt(e.target.value) || 0)
                }
                placeholder="Enter reward points"
              />
            </Col>
            <Col span={12}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>Completion Rate (%):</label>
              <Input
                type="number"
                value={formData.completionRate}
                onChange={(e) =>
                  handleInputChange("completionRate", parseInt(e.target.value) || 0)
                }
                placeholder="Enter completion %"
              />
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default MissionModal;
