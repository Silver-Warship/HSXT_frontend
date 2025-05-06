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
import { Avatar, Dropdown, Input, Layout, Menu, Modal, Select, Form, Space, message } from 'antd';
import { Header, Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { setUserInfo } from '../store/user/userSlice';
import { editUserInfo, EditUserInfoParams, getUserInfo } from '@/service/users';
import { getRunningSession } from '@/service/session';
import { ProFormRadio, ProFormText } from '@ant-design/pro-components';

const authTable: Record<string, (UserType | '')[]> = {
  dashboard: ['consultant', 'supervisor', 'admin'],
  record: ['consultant', 'supervisor', 'admin'],
  'help-record': ['consultant', 'supervisor', 'admin'],
  sessions: ['consultant', 'supervisor'],
  'manage-supervisor': ['admin'],
  'manage-consultant': ['admin'],
  'manage-visitor': ['admin'],
  schedule: ['admin'],
} as const;

export const ROLE_MAP = {
  admin: '管理员',
  consultant: '咨询师',
  supervisor: '督导',
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
  const { nickname, usertype, uid, email, gender } = useSelector((state: RootState) => state.user);

  const location = useLocation();
  const currentKey = location.pathname.split('/').pop() ?? 'dashboard';

  const [runningSession, setRunningSession] = useState<
    {
      label: string;
      key: string;
    }[]
  >([]);

  useEffect(() => {
    getUserInfo(usertype === 'consultant' ? 'counsellor' : usertype)
      .then((res) => {
        dispatch(setUserInfo(res));
      })
      .catch((e) => {
        console.error('获取用户信息出错', e);
      });
    getRunningSession({ userID: Number(uid) }).then((res) => {
      console.log(res);
      setRunningSession(
        res.sessions.map(({ firstUserID, secondUserID, sessionID, other: { nickname } }) => ({
          label: nickname,
          key: `session/${firstUserID}-${secondUserID}-${sessionID}`,
        })),
      );
    });
  }, []);

  const items = useMemo(
    () =>
      [
        getItem('工作台', 'dashboard', <PieChartOutlined />), // 咨询师、督导、管理员
        getItem('咨询记录', 'record', <HistoryOutlined />), // 咨询师(自己的)、督导（自己的，以及自己管的咨询师的）、管理员（所有）
        getItem('求助记录', 'help-record', <HistoryOutlined />),
        getItem(
          '咨询会话',
          'sessions',
          <UserOutlined />,
          runningSession.map(({ label, key }) => {
            return getItem(label, key);
          }),
        ), // 咨询师（与访客聊天）、督导（与咨询师聊天）
        getItem('督导管理', 'manage-supervisor', <TeamOutlined />), // 管理员
        getItem('咨询师管理', 'manage-consultant', <TeamOutlined />), // 管理员
        getItem('访客管理', 'manage-visitor', <UserSwitchOutlined />), // 管理员
        getItem('排班表', 'schedule', <CalendarOutlined />), // 管理员
      ].filter(({ key }) => authTable[key].includes(usertype ?? '')),
    [usertype, runningSession],
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
        onFinish(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async ({ gender, password, nickname }: { gender: GenderType; password: string; nickname: string }) => {
    if (!usertype || usertype === 'visitor') {
      message.error('出错啦');
      return;
    }
    const body: EditUserInfoParams = {
      gender,
      nickname,
      uid: Number(uid),
    };
    if (password) body['password'] = password;
    try {
      await editUserInfo(body, usertype === 'consultant' ? 'counsellor' : usertype);
      message.success('更新信息成功');
      navigate('/admin');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout className='h-[100vh] overflow-hidden' style={{ maxHeight: '100vh' }}>
      <Header>
        <div className='text-white h-full inline-flex flex-row items-center gap-4'>
          <img className='w-6 h-6 fill-white' src='/logo.svg' alt='logo' />
          <h1 className='text-xl font-[500]'>Heart Journey</h1>
        </div>
        <div className='absolute right-4 top-0'>
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
                if (key === '1') {
                  showModal();
                } else if (key === '2') {
                  // 退出登录逻辑
                  localStorage.removeItem('token');
                  localStorage.clear();
                  navigate('/admin/login');
                }
              },
            }}
          >
            <Space size='middle' className='cursor-pointer'>
              <div className='text-white select-none'>
                {usertype && ROLE_MAP[usertype as BUserType]} {nickname}
              </div>
              <Avatar size={36} src='/avatar.svg' />
            </Space>
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
        <Content className='px-10 py-6 min-h-[360px] overflow-y-auto'>
          <Outlet />
        </Content>
      </Layout>
      <Modal title='更新个人信息' styles={{ header: { marginBottom: '16px' } }} open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} name='update_info' initialValues={{ nickname, email, gender }} scrollToFirstError>
          <ProFormText
            fieldProps={{ variant: 'outlined', styles: { affixWrapper: { backgroundColor: '#ffffff80' } } }}
            name='nickname'
            label='昵称'
            placeholder='请输入昵称'
            rules={[{ required: true, message: '昵称不能为空' }]}
          />
          <ProFormText name='email' label='邮箱' readonly />
          <ProFormRadio.Group
            name='gender'
            label='性别'
            options={[
              { label: '男', value: 'male' },
              { label: '女', value: 'female' },
              { label: '保密', value: 'unknown' },
            ]}
          />
          <ProFormText.Password
            fieldProps={{ variant: 'outlined', styles: { affixWrapper: { backgroundColor: '#ffffff80' } } }}
            label='密码'
            name='password'
            rules={[
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/,
                message: '密码长度为 8 到 20 位，需要包含大写字母、小写字母、数字',
              },
            ]}
          />
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminLayout;
