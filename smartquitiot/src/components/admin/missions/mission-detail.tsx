"use client";
import React from "react";
import { Card, Button, Descriptions, Tag } from "antd";
import { ExtendedMission } from "@/types/extended-mission";

interface MissionDetailProps {
  mission: ExtendedMission;
  onBack: () => void;
}

const MissionDetail: React.FC<MissionDetailProps> = ({ mission, onBack }) => {
  return (
    <div>
      <Button onClick={onBack} style={{ marginBottom: 16 }}>
        ← Back to List
      </Button>

      <Card title={`Mission Details: ${mission.title}`}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Title">{mission.title}</Descriptions.Item>
          <Descriptions.Item label="Description">{mission.description}</Descriptions.Item>
          <Descriptions.Item label="Difficulty">
            <Tag
              color={
                mission.difficulty === "Easy"
                  ? "green"
                  : mission.difficulty === "Medium"
                  ? "orange"
                  : "red"
              }
            >
              {mission.difficulty}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={mission.status === "Active" ? "blue" : "gray"}>{mission.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Reward Points">{mission.rewardPoints}</Descriptions.Item>
          <Descriptions.Item label="Category">{mission.category}</Descriptions.Item>
          <Descriptions.Item label="Start Date">{mission.startDate}</Descriptions.Item>
          <Descriptions.Item label="End Date">{mission.endDate}</Descriptions.Item>
          <Descriptions.Item label="Completion Rate">{mission.completionRate}%</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default MissionDetail;
