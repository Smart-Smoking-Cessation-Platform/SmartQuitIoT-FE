"use client";
import React from 'react';
import { 
  Button, 
  Card,
  Row,
  Col,
  Descriptions,
  Divider,
  Avatar,
  Tag
} from 'antd';
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Member } from '@/types/member';

interface MemberDetailProps {
  member: Member;
  onBack: () => void;
}

const MemberDetail: React.FC<MemberDetailProps> = ({ member, onBack }) => {
  const getQuitStatusColor = (status: string) => {
    switch(status) {
      case 'Quitting': return 'orange';
      case 'Quit': return 'green';
      default: return 'red';
    }
  };

  return (
    <div>
      <Button onClick={onBack} style={{ marginBottom: 16 }}>
        ← Back to List
      </Button>
      
      <Card title={`Member Details: ${member.name}`}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={120} src={member.avatar} icon={<UserOutlined />} />
              <h3 style={{ marginTop: 16 }}>{member.name}</h3>
              <Tag color={member.status === 'Active' ? 'green' : 'red'}>
                {member.status}
              </Tag>
            </div>
          </Col>
          
          <Col span={16}>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="ID">{member.id}</Descriptions.Item>
              <Descriptions.Item label="Full Name">{member.name}</Descriptions.Item>
              <Descriptions.Item label="Email">
                <MailOutlined /> {member.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <PhoneOutlined /> {member.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                <CalendarOutlined /> {member.dateOfBirth}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                <HomeOutlined /> {member.address}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider>Smoking & Quitting Information</Divider>
        
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Quit Status">
                <Tag color={getQuitStatusColor(member.quitStatus)}>
                  {member.quitStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Cigarettes / Day">
                {member.cigarettesPerDay} cig/day
              </Descriptions.Item>
              <Descriptions.Item label="Join Date">{member.joinDate}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Experience">{member.experience}</Descriptions.Item>
              <Descriptions.Item label="Salary">${member.salary.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={member.status === 'Active' ? 'green' : 'red'}>
                  {member.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MemberDetail;
