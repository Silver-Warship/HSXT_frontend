import { ProForm, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-components';
import { Button, Card, Space, Table } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import ConsultRecordDetailModal from '../../components/ConsultRecordDetail';
import { exportConsultantRecord, getHelpRecord } from '@/service/Admin/chatRecord';
import downloadTXT from '@/utils/download';

type RecordTableItem = {
  key: number;
  consultant: string;
  supervisor: string;
  duration: string;
  date: Dayjs;
  sessionID: number;
  recordID: number;
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

const HelpRecordTable = ({ dataSource, pagination = true }: { dataSource: RecordTableItem[] | null; pagination?: boolean }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentSession, setCurrentSession] = useState<{
    sessionID: number;
    recordID: number;
  } | null>(null);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, { sessionID, recordID, consultant, supervisor, date }: RecordTableItem) => (
        <Space>
          <Button
            onClick={() => {
              setCurrentSession({ sessionID, recordID });
              setShowDetailModal(true);
            }}
            type='primary'
          >
            查看详情
          </Button>
          <Button
            onClick={() => {
              exportConsultantRecord(recordID)
                .then((res) => {
                  if (res.content) downloadTXT(res.content, `${consultant}-${supervisor}-${date.format('YYYY-MM-DD')}`);
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
            type='primary'
          >
            导出记录
          </Button>
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
        dataSource={dataSource ?? []}
        loading={!dataSource}
      />
      <ConsultRecordDetailModal isHelp={true} data={currentSession} visible={showDetailModal} onCancel={() => setShowDetailModal(false)} />
    </>
  );
};

const HelpRecord = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataSource, setDataSource] = useState<RecordTableItem[] | null>([]);

  const fetchData = async (counsellorID: number, supervisorID?: number, startTime?: Dayjs, endTime?: Dayjs) => {
    setDataSource(null);
    try {
      const res = await getHelpRecord({
        counsellorID: counsellorID,
        supervisorID: supervisorID,
        startTime: startTime,
        endTime: endTime,
      });
      setDataSource(
        res.helpRecords.map(({ counsellorName, supervisorName, helpSessionID, recordID }, index) => ({
          key: index,
          consultant: counsellorName,
          supervisor: supervisorName,
          duration: '',
          date: dayjs(),
          sessionID: helpSessionID,
          recordID: recordID,
        })),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const onFinish = async ({ consultant, supervisor, dateRange }: FormFieldsType) => {
    fetchData(
      Number(consultant.value),
      supervisor ? Number(supervisor.value) : undefined,
      dateRange ? dayjs(dateRange[0]) : undefined,
      dateRange ? dayjs(dateRange[1]) : undefined,
    );
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
            rules={[{ required: true }]}
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
