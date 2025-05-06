import { Button, Card } from 'antd';
import AdminChat from './AdminChat';

const Session = () => {
  return (
    <Card
      className='h-full'
      styles={{
        body: {
          padding: 0,
          height: 'calc(100% - 56px)',
        },
      }}
      title={`咨询者`}
    >
      <AdminChat />
    </Card>
  );
};

export default Session;
