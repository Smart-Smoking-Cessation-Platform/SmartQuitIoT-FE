"use client";
import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Input, 
  Select, 
  Row,
  Col,
  message as antdMessage
} from 'antd';
import { Member } from '@/types/member';

const { Option } = Select;

interface MemberModalProps {
  mode: 'add' | 'edit';
  visible: boolean;
  member?: Member | null; // dùng khi edit
  onCancel: () => void;
  onSave: (member: Member) => void;
}

const MemberModal: React.FC<MemberModalProps> = ({ mode, visible, member, onCancel, onSave }) => {
  const [formData, setFormData] = useState<Member>({
    id: Date.now(),
    name: '',
    email: '',
    phone: '',
    status: 'Active',
    avatar: '',
    joinDate: '',
    position: '',
    address: '',
    dateOfBirth: '',
    salary: 0,
    experience: '',
    quitStatus: 'Not Started',
    cigarettesPerDay: 0
  });

  const [messageApi, contextHolder] = antdMessage.useMessage();

  useEffect(() => {
    if (mode === 'edit' && member) {
      setFormData(member);
    }
  }, [mode, member]);

  const handleInputChange = <K extends keyof Member>(field: K, value: Member[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      messageApi.warning('Name and Email are required');
      return;
    }

    messageApi.success(mode === 'add' ? 'Member added successfully' : 'Member updated successfully');
    onSave(formData);

    // reset nếu add, edit thì giữ nguyên để tránh mất dữ liệu
    if (mode === 'add') {
      setFormData({
        id: Date.now(),
        name: '',
        email: '',
        phone: '',
        status: 'Active',
        avatar: '',
        joinDate: '',
        position: '',
        address: '',
        dateOfBirth: '',
        salary: 0,
        experience: '',
        quitStatus: 'Not Started',
        cigarettesPerDay: 0
      });
    }
  };

  const handleCancel = () => {
    onCancel();
    if (mode === 'add') {
      setFormData({
        id: Date.now(),
        name: '',
        email: '',
        phone: '',
        status: 'Active',
        avatar: '',
        joinDate: '',
        position: '',
        address: '',
        dateOfBirth: '',
        salary: 0,
        experience: '',
        quitStatus: 'Not Started',
        cigarettesPerDay: 0
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={mode === 'add' ? "Add New Member" : "Edit Member Information"}
        open={visible}
        onCancel={handleCancel}
        onOk={handleSave}
        width={600}
        okText={mode === 'add' ? "Add" : "Save"}
        cancelText="Cancel"
      >
        <div style={{ padding: '20px 0' }}>
          {/* Full Name & Email */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Full Name:</label>
              <Input 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
              />
            </Col>
            <Col span={12}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Email:</label>
              <Input 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </Col>
          </Row>

          {/* Phone & Status */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Phone:</label>
              <Input 
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </Col>
            <Col span={12}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Status:</label>
              <Select 
                style={{ width: '100%' }}
                value={formData.status}
                onChange={(value) => handleInputChange('status', value as 'Active' | 'Inactive')}
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Col>
          </Row>

          {/* Quit Status & Cigarettes Per Day */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Quit Status:</label>
              <Select
                style={{ width: '100%' }}
                value={formData.quitStatus}
                onChange={(value) => handleInputChange('quitStatus', value as 'Not Started' | 'Quitting' | 'Quit')}
              >
                <Option value="Not Started">Not Started</Option>
                <Option value="Quitting">Quitting</Option>
                <Option value="Quit">Quit</Option>
              </Select>
            </Col>
            <Col span={12}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Cigarettes / Day:</label>
              <Input
                type="number"
                value={formData.cigarettesPerDay}
                onChange={(e) => handleInputChange('cigarettesPerDay', parseInt(e.target.value) || 0)}
                placeholder="Enter number of cigarettes per day"
              />
            </Col>
          </Row>

          {/* Join Date & Date of Birth */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Join Date:</label>
              <Input 
                value={formData.joinDate}
                onChange={(e) => handleInputChange('joinDate', e.target.value)}
                placeholder="MM/DD/YYYY"
              />
            </Col>
            <Col span={12}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Date of Birth:</label>
              <Input 
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                placeholder="MM/DD/YYYY"
              />
            </Col>
          </Row>

          {/* Address */}
          <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Address:</label>
          <Input.TextArea 
            rows={2}
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter full address"
            style={{ marginBottom: 16 }}
          />

          {/* Salary & Experience */}
          <Row gutter={16}>
            <Col span={12}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Salary ($):</label>
              <Input 
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', parseInt(e.target.value) || 0)}
                placeholder="Enter salary amount"
              />
            </Col>
            <Col span={12}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Experience:</label>
              <Input 
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="e.g., 3 years"
              />
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default MemberModal;
