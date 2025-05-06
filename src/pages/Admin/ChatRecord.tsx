import { ProForm, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-components';
import { Button, Card, Rate, Space, Table } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import ConsultRecordDetailModal from '../../components/ConsultRecordDetail';
import { exportConsultantRecord, getConsultRecord } from '@/service/Admin/chatRecord';
import downloadTXT from '@/utils/download';
import { fuzzySearch } from '@/service/Admin/user';

type RecordTableItem = {
  key: number;
  consultant: string;
  visitor: string;
  duration: string;
  date: Dayjs;
  score: number;
  comment: string;
  help: string;
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
  visitor?: {
    label: string;
    value: string;
    key: string;
    title: string;
  };
  dateRange?: [string, string];
};

const ChatRecordTable = ({ dataSource, pagination = true }: { dataSource: RecordTableItem[] | null; pagination?: boolean }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentSession, setCurrentSession] = useState<{
    sessionID: number;
    recordID: number;
    comment: string;
  } | null>(null);

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
      dataIndex: 'action',
      title: '操作',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, { sessionID, recordID, consultant, visitor, date, comment }: RecordTableItem) => (
        <Space>
          <Button
            onClick={() => {
              setCurrentSession({ sessionID, recordID, comment });
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
                  if (res.content) downloadTXT(res.content, `${consultant}-${visitor}-${date.format('YYYY-MM-DD')}`);
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
                showSizeChanger: false,
              }
            : false
        }
        columns={columns}
        loading={!dataSource}
        dataSource={dataSource ?? []}
      />
      <ConsultRecordDetailModal data={currentSession} visible={showDetailModal} onCancel={() => setShowDetailModal(false)} />
    </>
  );
};

const ChatRecord = () => {
  const [dataSource, setDataSource] = useState<RecordTableItem[] | null>([]);

  const fetchData = async (counsellorID: number, userID?: number, startTime?: Dayjs, endTime?: Dayjs) => {
    setDataSource(null);
    try {
      const res = await getConsultRecord({
        counsellorID,
        userID,
        startTime,
        endTime,
      });
      setDataSource(
        res.consultantRecords.map(
          ({ counsellorName: consultantName, userName, duration, timestamp, userRating, appraisal, sessionID, recordID }, index) => ({
            key: index,
            consultant: consultantName,
            visitor: userName,
            duration: String(duration),
            date: dayjs(timestamp),
            score: userRating,
            comment: appraisal,
            help: '',
            sessionID: sessionID,
            recordID: recordID,
          }),
        ),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const onFinish = async ({ consultant, visitor, dateRange }: FormFieldsType) => {
    fetchData(
      Number(consultant.value),
      visitor ? Number(visitor.value) : undefined,
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
            debounceTime={500}
            mode='single'
            rules={[
              {
                required: true,
              },
            ]}
            request={async ({ keyWords = '' }) => {
              const res = await fuzzySearch(keyWords, 'counsellor');
              return res.infos.map(({ id, nickname }) => ({
                label: `${id} ${nickname}`,
                value: id,
              }));
            }}
            colProps={{
              span: 4,
            }}
          />
          <ProFormSelect.SearchSelect
            name='visitor'
            label='访客'
            debounceTime={500}
            mode='single'
            request={async ({ keyWords = '' }) => {
              const res = await fuzzySearch(keyWords, 'user');
              return res.infos.map(({ id, nickname }) => ({
                label: `${id} ${nickname}`,
                value: id,
              }));
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
