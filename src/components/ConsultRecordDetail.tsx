import { exportConsultantRecord } from '@/service/Admin/chatRecord';
import { getSessionMessages } from '@/service/session';
import downloadTXT from '@/utils/download';
import { Avatar, Card, List, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const ConsultRecordDetail = ({ isHelp, data }: { isHelp: boolean; data: Session.GetSessionMessagesContent[] | null }) => {
  return (
    <div className='flex flex-col max-h-[70vh]'>
      <div className='text-[18px] font-semibold mb-6'>咨询记录</div>
      {!isHelp && (
        <div>
          <div className='mb-2'>
            <p className='text-base mb-1'>咨询师评价</p>
            <p className='text-black-second'>11111111111111111111111111111111111111111111111</p>
          </div>
          <div className='mb-2'>
            <p className='text-base mb-1'>用户评价</p>
            <p className='text-black-second'>11111111111111111111111111111111111111111111111</p>
          </div>
        </div>
      )}
      <Card className='overflow-auto'>
        <List
          itemLayout='horizontal'
          loading={!data}
          dataSource={data ?? []}
          renderItem={({ sendID, content, timestamp }) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={''} />}
                title={
                  <Space>
                    {sendID}
                    <span style={{ color: 'gray', fontSize: '12px' }}>{dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </Space>
                }
                description={content}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

const ConsultRecordDetailModal = ({
  isHelp = false,
  data,
  visible,
  onCancel,
}: {
  isHelp?: boolean;
  data: {
    sessionID: number;
    recordID: number;
  } | null;
  visible: boolean;
  onCancel: () => void;
}) => {
  const [record, setRecord] = useState<Session.GetSessionMessagesContent[] | null>(null);

  const fetchData = async (sessionID: number) => {
    try {
      const res = await getSessionMessages(sessionID);
      setRecord(res.messages);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (data !== null) fetchData(data.sessionID);
  }, [data]);
  return (
    <Modal
      okText='导出记录'
      onOk={() => {
        if (data)
          exportConsultantRecord(data.recordID)
            .then((res) => {
              if (res.content) downloadTXT(res.content, data.recordID);
            })
            .catch((e) => {
              console.log(e);
            });
      }}
      destroyOnClose
      open={visible}
      onCancel={onCancel}
    >
      <ConsultRecordDetail isHelp={isHelp} data={record} />
    </Modal>
  );
};

export default ConsultRecordDetailModal;
