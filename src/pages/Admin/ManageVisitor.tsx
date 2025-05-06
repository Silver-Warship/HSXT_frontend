import { fuzzySearch } from '@/service/Admin/user';
import { ProForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Space, Button, Card, Table } from 'antd';
import { useState } from 'react';

type VisitorTableItem = {
  key: number;
  nickname: string;
  id: number;
  gender: string;
  // phone: string;
  email: string;
  // registerTime: Dayjs;
};

const ManageVisitor = () => {
  const onFinish = async ({ name, id }: { name: string; id: number }) => {
    setDataSource(null);
    const res = await fuzzySearch(name, 'user', id);
    setDataSource(
      res.infos.map(({ id, nickname, email }) => ({
        key: id,
        id: id,
        nickname: nickname,
        email: email,
        gender: 'male',
      })),
    );
  };

  const [dataSource, setDataSource] = useState<VisitorTableItem[] | null>([]);

  const columns = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'nickname',
      title: '昵称',
    },
    {
      dataIndex: 'gender',
      title: '性别',
    },
    // {
    //   dataIndex: 'phone',
    //   title: '电话',
    // },
    {
      dataIndex: 'email',
      title: '邮箱',
    },
    // {
    //   dataIndex: 'registerTime',
    //   title: '注册时间',
    //   render: (text: Dayjs) => {
    //     return text.format('YYYY-MM-DD HH:mm:ss');
    //   },
    // },
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
            name='name'
            label='访客昵称'
            colProps={{
              span: 4,
            }}
          />
          <ProFormDigit
            name='id'
            label='访客ID'
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
        dataSource={dataSource ?? []}
        loading={!dataSource}
      />
    </>
  );
};

export default ManageVisitor;
