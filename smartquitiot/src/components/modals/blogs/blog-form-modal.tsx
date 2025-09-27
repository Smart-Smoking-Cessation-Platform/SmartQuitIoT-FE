"use client";
import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { Blog } from "@/types/blog";

interface BlogFormModalProps {
  visible: boolean;
  blog: Blog | null;            // null = add new
  onCancel: () => void;
  onSave: (blogData: Partial<Blog>) => void;
}

const BlogFormModal: React.FC<BlogFormModalProps> = ({
  visible,
  blog,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (blog) {
      form.setFieldsValue(blog);
    } else {
      form.resetFields();
    }
  }, [blog, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave(values); // values chứa thông tin add/edit
    });
  };

  return (
    <Modal
      open={visible}
      title={blog ? "Edit Blog" : "Add Blog"}
      okText={blog ? "Update" : "Create"}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Short Description">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="thumbnail" label="Thumbnail URL">
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Content">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlogFormModal;
