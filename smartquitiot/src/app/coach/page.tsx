"use client"
import { ConfigProvider, Layout, Menu, Card, Statistic, Table, Tag, Avatar, Row, Col, Typography, Space, Button, Progress, Timeline, Checkbox, List, Radio } from "antd"
import type { ColumnsType } from 'antd/es/table'
import { Line } from "@ant-design/charts"
import { useState } from "react"
import { DollarCircleOutlined, ShoppingCartOutlined, UserAddOutlined, EyeOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons"

const { Header, Sider, Content } = Layout
const { Title, Link } = Typography

const weeklyData = [
    { day: 'Mon', sales: 1200 },
    { day: 'Tue', sales: 1500 },
    { day: 'Wed', sales: 1100 },
    { day: 'Thu', sales: 1800 },
    { day: 'Fri', sales: 2100 },
    { day: 'Sat', sales: 2500 },
    { day: 'Sun', sales: 2300 },
];

const monthlyData = [
    { month: 'Jan', sales: 8000 },
    { month: 'Feb', sales: 8500 },
    { month: 'Mar', sales: 9500 },
    { month: 'Apr', sales: 11000 },
    { month: 'May', sales: 10500 },
    { month: 'Jun', sales: 12000 },
];

const yearlyData = [
    { year: '2019', sales: 120000 },
    { year: '2020', sales: 135000 },
    { year: '2021', sales: 150000 },
    { year: '2022', sales: 140000 },
    { year: '2023', sales: 165000 },
];

const tableData: DataType[] = [
    { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', tags: ['NICE', 'DEVELOPER'] },
    { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', tags: ['LOSER'] },
    { key: '3', name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', tags: ['COOL', 'TEACHER'] },
];

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

const tableColumns: ColumnsType<DataType> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Tags', dataIndex: 'tags', key: 'tags', render: tags => (<>{tags.map((tag: string) => <Tag color={tag.length > 4 ? 'geekblue' : 'green'} key={tag}>{tag.toUpperCase()}</Tag>)}</>) },
    { title: 'Action', key: 'action', render: () => (<Space size="middle"><Link>Invite</Link><Link>Delete</Link></Space>) },
];

export default function CoachPage() {
  const [salesRange, setSalesRange] = useState('Weekly');

  const handleRangeChange = (e: any) => {
    setSalesRange(e.target.value);
  };

  const getCurrentSalesData = () => {
    switch (salesRange) {
      case 'Monthly':
        return monthlyData;
      case 'Yearly':
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  const getXField = () => {
    switch (salesRange) {
      case 'Monthly':
        return 'month';
      case 'Yearly':
        return 'year';
      default:
        return 'day';
    }
  };
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#7AC555', fontFamily: 'Poppins, sans-serif' } }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={200} theme="light">
            <div style={{ padding: '24px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>Ant Design</div>
            <Menu mode="inline" defaultSelectedKeys={['1']} items={[{ key: '1', icon: <MenuOutlined />, label: 'Dashboard' }]} />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Title level={4} style={{ margin: 0 }}>Ant Design</Title>
            <Space><Avatar icon={<UserOutlined />} /><span>Profile</span></Space>
          </Header>
          <Content style={{ padding: 24, background: '#f0f2f5', overflowY: 'auto' }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ background: '#4a90e2', color: 'white' }}><Statistic title="Total Sale" value={9541} prefix={<DollarCircleOutlined />} valueStyle={{ color: 'white' }} /></Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ background: '#50e3c2', color: 'white' }}><Statistic title="New Order" value={9541} prefix={<ShoppingCartOutlined />} valueStyle={{ color: 'white' }} /></Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ background: '#f5a623', color: 'white' }}><Statistic title="New User" value={9541} prefix={<UserAddOutlined />} valueStyle={{ color: 'white' }} /></Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ background: '#7ed321', color: 'white' }}><Statistic title="Unique Visitors" value={9541} prefix={<EyeOutlined />} valueStyle={{ color: 'white' }} /></Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card title="Sales Report" extra={
                        <Radio.Group value={salesRange} onChange={handleRangeChange}>
                            <Radio.Button value="Weekly">Weekly</Radio.Button>
                            <Radio.Button value="Monthly">Monthly</Radio.Button>
                            <Radio.Button value="Yearly">Yearly</Radio.Button>
                        </Radio.Group>
                    }>
                        <Line data={getCurrentSalesData()} xField={getXField()} yField='sales' smooth={true} color="#4a90e2" height={240} />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title="To-do Tasks">
                        <List
                            dataSource={['Meeting with Nabindar Singh', 'Exercise at 6pm with Nicholas', 'Avengers Age of Ultron', 'Henna birthday at Medscan', 'Meeting with John Brown at 7pm']}
                            renderItem={item => (<List.Item><Checkbox>{item}</Checkbox></List.Item>)}
                        />
                        <Button type="primary" style={{ marginTop: 16 }}>Add New Item</Button>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card title="Progress Report">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Progress percent={70} status="active" strokeColor="#4a90e2" />
                            <Progress percent={30} status="exception" strokeColor="#f5a623" />
                            <Progress percent={100} strokeColor="#7ed321" />
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title="Timeline">
                        <Timeline items={[{children:'Responded to need 2019-01-01'},{children:'Added an interest 2019-02-10'},{children:'Joined the group 2019-03-27'}]} />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title="User Comments">
                        <List
                            dataSource={[{name: 'Pauline L. Bird', text: 'Computer users and programmers have become so accustomed to using Windows.'}, {name: 'Ralph L. Alva', text: 'Computer users and programmers have become so accustomed to using Windows.'}] }
                            renderItem={item => (<List.Item><List.Item.Meta avatar={<Avatar icon={<UserOutlined />} />} title={item.name} description={item.text} /></List.Item>)}
                        />
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card title="Dynamic Custom Table">
                        <Table columns={tableColumns} dataSource={tableData} />
                    </Card>
                </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
