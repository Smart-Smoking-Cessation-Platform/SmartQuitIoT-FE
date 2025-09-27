import React from "react";
import { Card, Avatar, Tag, Button, Space } from "antd";
import { Badge } from "@/types/badge";

interface BadgeDetailProps {
  badge: Badge;
  onBack: () => void;
}

const BadgeDetail: React.FC<BadgeDetailProps> = ({ badge, onBack }) => {
  return (
    <Card
      title={badge.name}
      extra={<Button onClick={onBack}>Back</Button>}
      style={{ maxWidth: 600, margin: "auto" }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Avatar src={badge.icon} size={64} />
        <p>{badge.description}</p>
        <p>Points: {badge.points}</p>
        <Tag color={badge.status === "Active" ? "green" : "red"}>
          {badge.status}
        </Tag>
      </Space>
    </Card>
  );
};

export default BadgeDetail;
