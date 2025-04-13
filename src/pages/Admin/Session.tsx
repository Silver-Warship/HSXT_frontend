import { Button, Card, Splitter } from 'antd';

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
        <Splitter.Panel defaultSize='40%' min='20%' max='70%'>
          first
        </Splitter.Panel>
        <Splitter.Panel>second</Splitter.Panel>
      </Splitter>
    </Card>
  );
};

export default Session;
