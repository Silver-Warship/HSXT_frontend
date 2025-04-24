import { ProForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Space, Button, Card, Table } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

type VisitorTableItem = {
  key: number;
  nickname: string;
  uid: string;
  gender: string;
  phone: string;
  email: string;
  registerTime: Dayjs;
};

const ManageVisitor = () => {
  const onFinish = (values: { consultant: string; supervisor: string }) => {
    console.log('查询表单提交的值：', values);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataSource, setDataSource] = useState<VisitorTableItem[]>([
    {
      key: 1,
      nickname: '我是上帝',
      uid: '1234567890',
      gender: '男',
      phone: '12345678901',
      email: '123@qq.com',
      registerTime: dayjs(),
    },
  ]);

  const columns = [
    {
      dataIndex: 'nickname',
      title: '昵称',
    },
    {
      dataIndex: 'gender',
      title: '性别',
    },
    {
      dataIndex: 'uid',
      title: 'UID',
    },
    {
      dataIndex: 'phone',
      title: '电话',
    },
    {
      dataIndex: 'email',
      title: '邮箱',
    },
    {
      dataIndex: 'registerTime',
      title: '注册时间',
      render: (text: Dayjs) => {
        return text.format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      dataIndex: 'action',
      title: '操作',
      render: () => (
        <Space>
          <Button onClick={() => {}} type='primary'>
            修改信息
          </Button>
          <Button danger={true} type='primary'>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card style={{ marginBottom: 24 }}>
        <ProForm
          name='queryForm'
          onFinish={onFinish}
          layout='horizontal'
          grid={true}
          rowProps={{
            gutter: [32, 16],
          }}
          initialValues={{
            counselor: undefined,
            consultationDuration: [undefined, undefined],
            consultationDate: [undefined, undefined],
            rating: [undefined, undefined],
          }}
          submitter={{
            render: (_, doms) => {
              return (
                <div className='flex justify-end'>
                  <Space size='middle'>{doms}</Space>
                </div>
              );
            },
          }}
        >
          <ProFormText
            name='visitor'
            label='访客昵称'
            colProps={{
              span: 4,
            }}
          />
          <ProFormDigit
            name='uid'
            label='访客UID'
            colProps={{
              span: 4,
            }}
          />
        </ProForm>
      </Card>
      <Table
        className='w-full'
        pagination={{
          position: ['topRight', 'bottomRight'],
          pageSize: 5,
        }}
        columns={columns}
        dataSource={dataSource}
      />
    </>
  );
};

export default ManageVisitor;
