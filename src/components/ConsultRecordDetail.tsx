import { Avatar, Card, List, Modal, Space } from 'antd';
import dayjs from 'dayjs';

const ConsultRecordDetail = () => {
  const chatRecords = [
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '张三',
      content: '你好呀！',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '李四',
      content: '哈喽，最近咋样？',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '张三',
      content: '你好呀！',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '李四',
      content: '哈喽，最近咋样？',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '张三',
      content: '你好呀！',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '李四',
      content: '哈喽，最近咋样？',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '张三',
      content: '你好呀！',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '李四',
      content: '哈喽，最近咋样？',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '张三',
      content: '你好呀！',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '李四',
      content: '哈喽，最近咋样？',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '张三',
      content: '你好呀！',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '李四',
      content: '哈喽，最近咋样？',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '张三',
      content: '你好呀！',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '李四',
      content: '哈喽，最近咋样？',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '张三',
      content: '你好呀！',
      timestamp: new Date(),
    },
    {
      avatar: 'https://picsum.photos/200/200',
      nickname: '李四',
      content: '哈喽，最近咋样？',
      timestamp: new Date(),
    },
  ];
  return (
    <div className='flex flex-col max-h-[70vh]'>
      <div className='text-[18px] font-semibold mb-6'>咨询记录 2025-04-17 08:11:23</div>
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
      <Card className='overflow-auto'>
        <List
          itemLayout='horizontal'
          dataSource={chatRecords}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={
                  <Space>
                    {item.nickname}
                    <span style={{ color: 'gray', fontSize: '12px' }}>{dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </Space>
                }
                description={item.content}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

const ConsultRecordDetailModal = ({ visible, onCancel }: { visible: boolean; onCancel: () => void }) => {
  return (
    <Modal okText='导出记录' destroyOnClose open={visible} onCancel={onCancel}>
      <ConsultRecordDetail />
    </Modal>
  );
};

export default ConsultRecordDetailModal;
