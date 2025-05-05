import { ProForm, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-components';
import { Button, Card, Rate, Space, Table } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import ConsultRecordDetailModal from '../../components/ConsultRecordDetail';

type RecordTableItem = {
  key: number;
  consultant: string;
  supervisor: string;
  duration: string;
  date: Dayjs;
};

type FormFieldsType = {
  consultant: {
    label: string;
    value: string;
    key: string;
    title: string;
  };
  supervisor: {
    label: string;
    value: string;
    key: string;
    title: string;
  };
  dateRange: [string, string];
};

const HelpRecordTable = ({ dataSource, pagination = true }: { dataSource: RecordTableItem[]; pagination?: boolean }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const columns = [
    {
      dataIndex: 'consultant',
      title: '咨询师',
    },
    {
      dataIndex: 'supervisor',
      title: '督导',
    },
    {
      dataIndex: 'duration',
      title: '求助时长',
    },
    {
      dataIndex: 'date',
      title: '求助日期',
      render: (date: Dayjs) => date.format('YYYY-MM-DD HH:mm:ss'),
      sorter: ({ date: a }: RecordTableItem, { date: b }: RecordTableItem) => {
        return a.isBefore(b) ? -1 : 1;
      },
    },
    {
      dataIndex: 'action',
      title: '操作',
      render: () => (
        <Space>
          <Button
            onClick={() => {
              setShowDetailModal(true);
            }}
            type='primary'
          >
            查看详情
          </Button>
          <Button type='primary'>导出记录</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        className='w-full'
        pagination={
          pagination
            ? {
                position: ['topRight', 'bottomRight'],
                pageSize: 5,
              }
            : false
        }
        columns={columns}
        dataSource={dataSource}
      />
      <ConsultRecordDetailModal visible={showDetailModal} onCancel={() => setShowDetailModal(false)} />
    </>
  );
};

const HelpRecord = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataSource, setDataSource] = useState<RecordTableItem[]>([
    {
      key: 1,
      consultant: '1',
      supervisor: '2',
      duration: '00:12:54',
      date: dayjs('2024-10-10 13:24:00', 'YYYY-MM-DD HH:mm:ss'),
    },
    {
      key: 2,
      consultant: '3',
      supervisor: '4',
      duration: '00:12:54',
      date: dayjs('2025-10-10 13:24:00', 'YYYY-MM-DD HH:mm:ss'),
    },
    {
      key: 3,
      consultant: '5',
      supervisor: '6',
      duration: '00:12:54',
      date: dayjs('2025-06-10 13:24:00', 'YYYY-MM-DD HH:mm:ss'),
    },
  ]);

  const onFinish = (values: FormFieldsType) => {
    console.log('查询表单提交的值：', values);
  };

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
          <ProFormDateRangePicker
            label='咨询日期'
            name='dateRange'
            colProps={{
              span: 8,
            }}
          />
        </ProForm>
      </Card>
      <HelpRecordTable dataSource={dataSource} />
    </>
  );
};

export default HelpRecord;
export { HelpRecordTable, HelpRecord };
