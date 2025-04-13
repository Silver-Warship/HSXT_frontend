import {
  PieChartOutlined,
  UserOutlined,
  TeamOutlined,
  HistoryOutlined,
  UserSwitchOutlined,
  CalendarOutlined,
  EditOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Input, Layout, Menu, Modal, Select, Form } from 'antd';
import { Header, Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { setUserInfo } from '../store/user/userSlice';

const authTable: Record<string, UserType[]> = {
  dashboard: ['consultant', 'supervisor', 'admin'],
  record: ['consultant', 'supervisor', 'admin'],
  sessions: ['consultant', 'supervisor'],
  'manage-supervisor': ['admin'],
  'manage-consultant': ['admin'],
  'manage-visitor': ['admin'],
  schedule: ['admin'],
} as const;

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  children: MenuItem[] | undefined;
  label: string;
};

function getItem(label: string, key: string, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  };
}

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { usertype } = useSelector((state: RootState) => state.user);

  const location = useLocation();
  const currentKey = location.pathname.split('/').pop() ?? 'dashboard';

  const items = useMemo(
    () =>
      [
        getItem('工作台', 'dashboard', <PieChartOutlined />), // 咨询师、督导、管理员
        getItem('咨询记录', 'record', <HistoryOutlined />), // 咨询师(自己的)、督导（自己的，以及自己管的咨询师的）、管理员（所有）
        getItem('咨询会话', 'sessions', <UserOutlined />, [getItem('Tom', 'session/1'), getItem('Bill', 'session/4'), getItem('Alex', 'session/5')]), // 咨询师（与访客聊天）、督导（与咨询师聊天）
        getItem('督导管理', 'manage-supervisor', <TeamOutlined />), // 管理员
        getItem('咨询师管理', 'manage-consultant', <TeamOutlined />), // 管理员
        getItem('访客管理', 'manage-visitor', <UserSwitchOutlined />), // 管理员
        getItem('排班表', 'schedule', <CalendarOutlined />), // 管理员
      ].filter(({ key }) => authTable[key].includes(usertype)),
    [usertype],
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // 这里可以处理表单提交逻辑，例如发送请求到后端更新数据
        console.log('Received values of form: ', values);
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout className='h-[100vh] overflow-hidden' style={{ maxHeight: '100vh' }}>
      <Header>
        <div className='text-white h-full inline-flex flex-row items-center gap-4'>
          <img className='w-6 h-6 fill-white' src='/logo.svg' alt='logo' />
          <h1 className='text-xl font-[500]'>Heart Journey</h1>
        </div>
        <div className='absolute right-4 top-0'>
          <Select
            defaultValue={usertype}
            onChange={(value) => {
              console.log(value);
              dispatch(setUserInfo({ usertype: value }));
            }}
            className='w-40'
            options={[
              {
                value: 'admin',
                label: '管理员',
              },
              {
                value: 'consultant',
                label: '咨询师',
              },
              {
                value: 'supervisor',
                label: '督导',
              },
            ]}
          />
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <>
                      <EditOutlined />
                      <span> 编辑个人信息</span>
                    </>
                  ),
                  key: '1',
                },
                {
                  label: (
                    <>
                      <PoweroffOutlined />
                      <span> 退出登录</span>
                    </>
                  ),
                  key: '2',
                },
              ],
              onClick: ({ key }) => {
                console.log(`Click on item ${key}`);
                if (key === '1') {
                  showModal();
                } else if (key === '2') {
                  // 退出登录逻辑
                }
              },
            }}
          >
            <Avatar size={36} src='/avatar.svg' />
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <Menu
            onClick={(e) => {
              const { key } = e;
              navigate(`/admin/${key}`);
            }}
            theme='dark'
            defaultOpenKeys={['sessions']}
            defaultSelectedKeys={[currentKey]}
            mode='inline'
            items={items}
          />
        </Sider>
        <Content className='px-4 overflow-y-auto'>
          <div className='p-6 min-h-[360px] h-full'>
            <Outlet />
          </div>
        </Content>
      </Layout>
      <Modal title='更新个人信息' open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form
          form={form}
          name='update_info'
          initialValues={{
            name: '',
            email: '',
            phone: '',
          }}
          scrollToFirstError
        >
          <Form.Item
            name='name'
            label='姓名'
            rules={[
              {
                required: true,
                message: '请输入姓名',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='email'
            label='邮箱'
            rules={[
              {
                type: 'email',
                message: '请输入有效的邮箱地址',
              },
              {
                required: true,
                message: '请输入邮箱地址',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='phone'
            label='电话'
            rules={[
              {
                required: true,
                message: '请输入电话号码',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminLayout;
