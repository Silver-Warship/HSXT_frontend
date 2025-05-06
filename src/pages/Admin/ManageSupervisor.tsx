import AddAdminModal from '@/components/AddAdminModal';
import { deleteRole } from '@/service/Admin/roleManage';
import { fuzzySearch } from '@/service/Admin/user';
import { ProForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Card, Space, Button, Table, message } from 'antd';
import { useState } from 'react';

type SupervisorTableItem = {
  key: number;
  id: number;
  gender: string;
  supervisor: string;
  email: string;
};

const ManageSupervisor = () => {
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);

  const deleteSupervisor = async (id: number) => {
    try {
      const role = 'supervisor';
      await deleteRole(id, role);
      setDataSource(
        dataSource?.filter((item) => item.id!== id)?? [],
      );
      message.success('删除成功');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error('删除失败');
    }
  }

  const onFinish = async ({ supervisorName: name, supervisorID: id }: { supervisorName: string; supervisorID: number }) => {
    setDataSource(null);
    const res = await fuzzySearch(name, 'supervisor', id);
    setDataSource(
      res.infos.map(({ id, nickname, email }) => ({
        key: id,
        id: id,
        supervisor: nickname,
        email: email,
        gender: 'male',
      })),
    );
  };

  const [dataSource, setDataSource] = useState<SupervisorTableItem[] | null>([]);

  const columns = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'supervisor',
      title: '督导',
    },
    {
      dataIndex: 'gender',
      title: '性别',
    },
    // {
    //   dataIndex: 'consultants',
    //   title: '绑定咨询师',
    //   render: (text: string[]) => {
    //     return text.join(', ');
    //   },
    // },
    // {
    //   dataIndex: 'helpNum',
    //   title: '求助数',
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
      render: (_, record: SupervisorTableItem) => (
        <Space>
          <Button onClick={() => {deleteSupervisor(record.id)}}  danger={true} type='primary'>
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
          <ProFormText
            name='supervisorName'
            label='督导昵称'
            colProps={{
              span: 4,
            }}
          />
          <ProFormDigit
            name='supervisorID'
            label='督导ID'
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
