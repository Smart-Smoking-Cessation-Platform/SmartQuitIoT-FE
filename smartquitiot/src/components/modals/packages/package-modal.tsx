"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { MembershipPackage } from "@/types/membership-package";
const { TextArea } = Input;


interface PackageModalProps {
  mode: "add" | "edit";
  visible: boolean;
  membershipPackage?: MembershipPackage;
  onCancel: () => void;
  onSave: (pkg: MembershipPackage) => void;
}

const PackageModal: React.FC<PackageModalProps> = ({
  mode,
  visible,
  membershipPackage,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === "edit" && membershipPackage) {
      form.setFieldsValue(membershipPackage);
    } else {
      form.resetFields();
    }
  }, [mode, membershipPackage, form, visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSave({ ...membershipPackage, ...values });
        form.resetFields();
      })
      .catch((info) => {
        message.error("Please fill all required fields correctly.");
      });
  };

  return (
    <Modal
      title={mode === "add" ? "Add New Package" : "Edit Package"}
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText={mode === "add" ? "Add" : "Save"}
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: "",
          duration: "",
          price: 0,
          description: "",
          status: "Active",
        }}
      >
        <Form.Item
          label="Package Name"
          name="name"
          rules={[{ required: true, message: "Please input package name" }]}
        >
          <Input placeholder="Enter package name" />
        </Form.Item>

        <Form.Item
          label="Duration"
          name="duration"
          rules={[{ required: true, message: "Please input duration" }]}
        >
          <Input placeholder="e.g. 1 Month, 6 Months" />
        </Form.Item>

        <Form.Item
          label="Price ($)"
          name="price"
          rules={[{ required: true, message: "Please input price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input description" }]}
        >
          <TextArea rows={3} placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select>
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PackageModal;
