"use client";

import React from "react";
import { Modal, Descriptions, Tag } from "antd";

interface MembershipPackage {
  id?: number;
  name: string;
  duration: string;
  price: number;
  description: string;
  status: "Active" | "Inactive";
}

interface PackageDetailModalProps {
  visible: boolean;
  membershipPackage: MembershipPackage | null;
  onClose: () => void;
}

const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  visible,
  membershipPackage,
  onClose,
}) => {
  if (!membershipPackage) return null;

  return (
    <Modal
      title="Package Details"
      open={visible}
      footer={null}
      onCancel={onClose}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Package Name">{membershipPackage.name}</Descriptions.Item>
        <Descriptions.Item label="Duration">{membershipPackage.duration}</Descriptions.Item>
        <Descriptions.Item label="Price">${membershipPackage.price}</Descriptions.Item>
        <Descriptions.Item label="Description">{membershipPackage.description}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={membershipPackage.status === "Active" ? "green" : "red"}>
            {membershipPackage.status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PackageDetailModal;
