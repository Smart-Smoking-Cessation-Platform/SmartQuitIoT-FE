"use client";
import React from "react";
import { Modal, Descriptions, Typography } from "antd";

interface BlogDetailModalProps {
  visible: boolean;
  onClose: () => void;
  blog: {
    id: string;
    title: string;
    content: string;
    thumbnail?: string;
    likes: number;
    createdAt: string;
  } | null;
}

const BlogDetailModal: React.FC<BlogDetailModalProps> = ({
  visible,
  onClose,
  blog,
}) => {
  if (!blog) return null;

  return (
    <Modal
      title={blog.title}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <img
        src={blog.thumbnail || "https://via.placeholder.com/800x400"}
        alt={blog.title}
        style={{ width: "100%", marginBottom: 16 }}
      />
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Ngày tạo">{blog.createdAt}</Descriptions.Item>
        <Descriptions.Item label="Lượt thích">{blog.likes}</Descriptions.Item>
        <Descriptions.Item label="Nội dung">
          <Typography.Paragraph>{blog.content}</Typography.Paragraph>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default BlogDetailModal;
