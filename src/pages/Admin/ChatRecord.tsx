import { ProForm, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-components';
import { Button, Card, Rate, Space, Table } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import ConsultRecordDetailModal from '../../components/ConsultRecordDetail';

type RecordTableItem = {
  key: number;
  consultant: string;
  visitor: string;
  duration: string;
  date: Dayjs;
  score: number;
  comment: string;
  help: string;
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

const ChatRecordTable = ({ dataSource, pagination = true }: { dataSource: RecordTableItem[]; pagination?: boolean }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const columns = [
    {
      dataIndex: 'consultant',
      title: '咨询师',
    },
    {
      dataIndex: 'visitor',
      title: '咨询者',
    },
    {
      dataIndex: 'duration',
      title: '咨询时长',
    },
    {
      dataIndex: 'date',
      title: '咨询日期',
      render: (date: Dayjs) => date.format('YYYY-MM-DD HH:mm:ss'),
      sorter: ({ date: a }: RecordTableItem, { date: b }: RecordTableItem) => {
        return a.isBefore(b) ? -1 : 1;
      },
    },
    {
      dataIndex: 'score',
      title: '评分',
      render: (score: number) => <Rate disabled allowHalf defaultValue={0} value={score} />,
    },
    {
      dataIndex: 'comment',
      title: '评价',
      render: (comment: string) => (
        <div title={comment} className='line-clamp-1 max-w-[200px]'>
          {comment}
        </div>
      ),
    },
    {
      dataIndex: 'help',
      title: '督导求助',
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

const ChatRecord = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataSource, setDataSource] = useState<RecordTableItem[]>([
    {
      key: 1,
      consultant: '1',
      visitor: '2',
      duration: '00:12:54',
      date: dayjs('2024-10-10 13:24:00', 'YYYY-MM-DD HH:mm:ss'),
      score: 4,
      comment: '很好，很专业很好，很专业很好，很专业很好，很专业很好，很专业很好，很专业很好，很专业',
      help: '无',
    },
    {
      key: 2,
      consultant: '3',
      visitor: '4',
      duration: '00:12:54',
      date: dayjs('2025-10-10 13:24:00', 'YYYY-MM-DD HH:mm:ss'),
      score: 4,
      comment: '很好，很专业很好，很专业很好，很专业很好，很专业很好，很专业很好，很专业很好，很专业',
      help: '无',
    },
    {
      key: 3,
      consultant: '5',
      visitor: '6',
      duration: '00:12:54',
      date: dayjs('2025-06-10 13:24:00', 'YYYY-MM-DD HH:mm:ss'),
      score: 4,
      comment: '很好，很专业很好，很专业很好，很专业很好，很专业很好，很专业很好，很专业很好，很专业',
      help: '无',
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
      <ChatRecordTable dataSource={dataSource} />
    </>
  );
};

export default ChatRecord;
export { ChatRecordTable, ChatRecord };
