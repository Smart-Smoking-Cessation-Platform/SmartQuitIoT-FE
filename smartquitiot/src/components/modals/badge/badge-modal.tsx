import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import { Badge } from "@/types/badge";
interface BadgeModalProps {
  visible: boolean;
  mode: "add" | "edit";
  badge?: Badge;
  onCancel: () => void;
  onSave: (badge: Badge) => void;
}

const BadgeModal: React.FC<BadgeModalProps> = ({
  visible,
  mode,
  badge,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === "edit" && badge) {
      form.setFieldsValue(badge);
    } else {
      form.resetFields();
    }
  }, [mode, badge]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newBadge: Badge = {
        ...values,
        id: badge?.id || Date.now(), // ID auto
      };
      onSave(newBadge);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={mode === "add" ? "Add New Badge" : "Edit Badge"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText={mode === "add" ? "Add" : "Save"}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Badge Name"
          rules={[{ required: true, message: "Please input badge name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="icon"
          label="Icon URL"
          rules={[{ required: true, message: "Please input icon URL!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="points"
          label="Points"
          rules={[{ required: true, message: "Please input points!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="status" label="Status" initialValue="Active">
          <Select>
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BadgeModal;
