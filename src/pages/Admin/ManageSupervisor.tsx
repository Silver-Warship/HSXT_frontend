import AddAdminModal from '@/components/AddAdminModal';
import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import { Card, Space, Button, Table } from 'antd';
import { useState } from 'react';

type SupervisorTableItem = {
  key: number;
  consultants: string[];
  gender: string;
  supervisor: string;
  helpNum: number;
  phone: string;
  email: string;
};

const ManageSupervisor = () => {
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);
  const onFinish = (values: { supervisor: string }) => {
    console.log('查询表单提交的值：', values);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataSource, setDataSource] = useState<SupervisorTableItem[]>([
    {
      key: 1,
      consultants: ['111', '222'],
      gender: '男',
      supervisor: '我是你爹',
      helpNum: 10,
      phone: '12345678901',
      email: '123@qq.com',
    },
  ]);

  const columns = [
    {
      dataIndex: 'supervisor',
      title: '督导',
    },
    {
      dataIndex: 'gender',
      title: '性别',
    },
    {
      dataIndex: 'consultants',
      title: '绑定咨询师',
      render: (text: string[]) => {
        return text.join(', ');
      },
    },
    {
      dataIndex: 'helpNum',
      title: '求助数',
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
                  <Space size='middle'>
                    <Button
                      onClick={() => {
                        setShowAddSupervisor(true);
                      }}
                      className='mr-6'
                      type='primary'
                    >
                      新增督导
                    </Button>
                    {doms}
                  </Space>
                </div>
              );
            },
          }}
        >
          <ProFormSelect.SearchSelect
            name='supervisor'
            label='督导'
            debounceTime={200}
            mode='single'
            request={async ({ keyWords = '' }) => {
              return [
                { label: '1号', value: '1' },
                { label: '2号', value: '2' },
              ].filter(({ value, label }) => {
                return value.includes(keyWords) || label.includes(keyWords);
              });
            }}
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
      <AddAdminModal
        visible={showAddSupervisor}
        onHide={() => {
          setShowAddSupervisor(false);
        }}
        role='supervisor'
      />
    </>
  );
};

export default ManageSupervisor;
