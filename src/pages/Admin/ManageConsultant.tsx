import AddAdminModal from '@/components/AddAdminModal';
import { fuzzySearch } from '@/service/Admin/user';
import { ProForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, Card, Rate, Space, Table } from 'antd';
import { useState } from 'react';

type ConsultantTableItem = {
  key: number;
  id: number;
  gender: string;
  consultant: string;
  email: string;
};

const ManageConsultant = () => {
  const [showAddConsultant, setShowAddConsultant] = useState(false);

  const onFinish = async ({ name, id }: { name: string; id: number }) => {
    setDataSource(null);
    const res = await fuzzySearch(name, 'counsellor', id);
    setDataSource(
      res.infos.map(({ id, nickname, email }) => ({
        key: id,
        id: id,
        consultant: nickname,
        email: email,
        gender: 'male',
      })),
    );
  };

  const [dataSource, setDataSource] = useState<ConsultantTableItem[] | null>([]);

  const columns = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'consultant',
      title: '咨询师',
    },
    {
      dataIndex: 'gender',
      title: '性别',
    },
    // {
    //   dataIndex: 'supervisor',
    //   title: '绑定督导',
    // },
    // {
    //   dataIndex: 'counselNum',
    //   title: '总咨询数',
    // },
    // {
    //   dataIndex: 'score',
    //   title: '综合评分',
    //   render: (score: number) => <Rate disabled allowHalf defaultValue={0} value={score} />,
    // },
    // {
    //   dataIndex: 'phone',
    //   title: '电话',
    // },
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
          <ProFormText
            name='name'
            label='咨询师昵称'
            colProps={{
              span: 4,
            }}
          />
          <ProFormDigit
            name='id'
            label='咨询师ID'
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
