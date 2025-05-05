import AddAdminModal from '@/components/AddAdminModal';
import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import { Button, Card, Rate, Space, Table } from 'antd';
import { useState } from 'react';

type ConsultantTableItem = {
  key: number;
  consultant: string;
  gender: string;
  supervisor: string;
  counselNum: number;
  score: number;
  phone: string;
  email: string;
};

const ManageConsultant = () => {
  const [showAddConsultant, setShowAddConsultant] = useState(false);
  const onFinish = (values: { consultant: string }) => {
    console.log('查询表单提交的值：', values);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataSource, setDataSource] = useState<ConsultantTableItem[]>([
    {
      key: 1,
      consultant: '111',
      gender: '男',
      supervisor: '我是你爹',
      counselNum: 10,
      score: 4.5,
      phone: '12345678901',
      email: '123@qq.com',
    },
  ]);

  const columns = [
    {
      dataIndex: 'consultant',
      title: '咨询师',
    },
    {
      dataIndex: 'gender',
      title: '性别',
    },
    {
      dataIndex: 'supervisor',
      title: '绑定督导',
    },
    {
      dataIndex: 'counselNum',
      title: '总咨询数',
    },
    {
      dataIndex: 'score',
      title: '综合评分',
      render: (score: number) => <Rate disabled allowHalf defaultValue={0} value={score} />,
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
                        setShowAddConsultant(true);
                      }}
                      className='mr-6'
                      type='primary'
                    >
                      新增咨询师
                    </Button>
                    {doms}
                  </Space>
                </div>
              );
            },
          }}
        >
          <ProFormSelect.SearchSelect
            name='consultant'
            label='咨询师'
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
        visible={showAddConsultant}
        onHide={() => {
          setShowAddConsultant(false);
        }}
        role='consultant'
      />
    </>
  );
};

export default ManageConsultant;
