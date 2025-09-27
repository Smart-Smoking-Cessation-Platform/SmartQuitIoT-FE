// components/common/delete-confirm-modal.tsx
"use client";
import React from 'react';
import { Modal } from 'antd';

interface DeleteConfirmModalProps {
  visible: boolean;
  title?: string;
  content?: string | React.ReactNode;
  okText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  title = 'Confirm Delete',
  content = 'Are you sure?',
  okText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      open={visible}
      title={title}
      okText={okText}
      cancelText={cancelText}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      {content}
    </Modal>
  );
};

export default DeleteConfirmModal;
