import { Button, Card, Splitter } from 'antd';
import AdminChat from './AdminChat';
import { BulbTwoTone } from '@ant-design/icons';

const Session = () => {
  return (
    <Card
      className='h-full flex flex-col'
      styles={{
        body: {
          flexGrow: 1,
          padding: 0,
        },
      }}
      title={`咨询者-小明`}
      extra={
        <div className='flex gap-2 items-center'>
          <div className='text-base mr-4'>咨询时长: 13分钟</div>
          <Button color='primary' variant='outlined'>
            求助督导
          </Button>
          <Button type='primary' danger>
            结束咨询
          </Button>
        </div>
      }
    >
      <Splitter className='h-full'>
        <Splitter.Panel defaultSize='70%' min='30%' max='70%'>
          <AdminChat />
        </Splitter.Panel>
        <Splitter.Panel>
          <div className='h-full w-full flex items-center justify-center'>
            <div className='cursor-pointer flex flex-col items-center gap-4 border border-gray-200 hover:bg-gray-100 transition p-4 px-6 rounded-md'>
              <BulbTwoTone className='text-[60px]' />
              <p className='text-base select-none'>求助督导</p>
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </Card>
  );
};

export default Session;
