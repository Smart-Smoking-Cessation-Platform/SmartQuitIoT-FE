import React from "react";
import { Card, Button, Space, Typography } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  LikeOutlined,
} from "@ant-design/icons";

interface BlogCardProps {
  title: string;
  thumbnail: string;
  description: string;
  likes: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  thumbnail,
  description,
  likes,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      hoverable
      cover={
        <img
          alt={title}
          src={thumbnail}
          style={{
            height: 180,
            objectFit: "cover",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      }
      style={{
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      bodyStyle={{ padding: 16 }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.15)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 1px 3px rgba(0,0,0,0.1)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <Typography.Title
        level={5}
        style={{
          marginBottom: 8,
          minHeight: 48,
        }}
      >
        {title}
      </Typography.Title>
      <Typography.Paragraph
        type="secondary"
        style={{ marginBottom: 12, minHeight: 40 }}
      >
        {description}
      </Typography.Paragraph>

      <Space style={{ marginBottom: 12 }}>
        <LikeOutlined style={{ color: "#1677ff" }} /> {likes}
      </Space>

      <Space>
        <Button icon={<EyeOutlined />} size="small" onClick={onView}>
          View
        </Button>
        <Button icon={<EditOutlined />} size="small" onClick={onEdit}>
          Edit
        </Button>
        <Button
          icon={<DeleteOutlined />}
          size="small"
          danger
          onClick={onDelete}
        >
          Delete
        </Button>
      </Space>
    </Card>
  );
};

export default BlogCard;
