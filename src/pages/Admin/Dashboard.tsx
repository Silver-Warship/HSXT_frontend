import { DualAxes } from '@ant-design/charts';
import { BellTwoTone, CalendarOutlined, LikeTwoTone, StarTwoTone } from '@ant-design/icons';
import { Calendar, Card, Col, Row, Statistic } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ChatRecordTable } from './ChatRecord';

const dutyDays: {
  [year: number]: {
    [month: number]: number[];
  };
} = {
  2025: {
    4: [1, 13, 14, 25],
    5: [2, 14, 26],
  },
};

const Dashboard = () => {
  const uvData = [
    { time: '2019-03', 咨询时长: 35 },
    { time: '2019-04', 咨询时长: 90 },
    { time: '2019-05', 咨询时长: 30 },
    { time: '2019-06', 咨询时长: 45 },
    { time: '2019-07', 咨询时长: 47 },
  ];

  const transformData = [
    { time: '2019-03', 咨询次数: 12 },
    { time: '2019-04', 咨询次数: 6 },
    { time: '2019-05', 咨询次数: 4 },
    { time: '2019-06', 咨询次数: 20 },
    { time: '2019-07', 咨询次数: 16 },
  ];

  const config = {
    xField: 'time',
    legend: true,
    scale: { color: { range: ['#1783FF', '#5AD8A6', '#5D7092', '#F6BD16'] } },
    interaction: { tooltip: {} },
    children: [
      {
        data: uvData,
        type: 'interval',
        yField: '咨询时长',
        style: { maxWidth: 80 },
      },
      {
        data: transformData,
        type: 'line',
        yField: '咨询次数',
        axis: { y: { position: 'right' } },
        style: { lineWidth: 2 },
      },
    ],
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={14}>
          <Row className='h-full' gutter={[16, 16]}>
            <Col style={{ display: 'inline-flex' }} span={8}>
              <Card className='w-full' variant='borderless'>
                <Statistic
                  title='当前综合评价'
                  value={4.23}
                  precision={2}
                  prefix={<StarTwoTone twoToneColor='#fdd90d' className='text-[#fdd90d]' />}
                />
              </Card>
            </Col>
            <Col style={{ display: 'inline-flex' }} span={8}>
              <Card className='w-full' variant='borderless'>
                <Statistic title='进行中的咨询' value={3} prefix={<BellTwoTone twoToneColor='#eb2f96' />} />
              </Card>
            </Col>
            <Col style={{ display: 'inline-flex' }} span={8}>
              <Card className='w-full' variant='borderless'>
                <Statistic title='累计完成咨询' value={132} prefix={<LikeTwoTone twoToneColor='#52c41a' />} />
              </Card>
            </Col>
            <Col style={{ display: 'flex' }} span={24}>
              <Card className='h-full w-full'>
                <DualAxes height={360} {...config} />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={10}>
          <Card className='h-full'>
            <div className='text-xl'>
              {dayjs().format('YYYY-MM-DD')}
              <span className='ml-2 text-sm text-gray-400'>本月需值班 {dutyDays['2025'][dayjs().month() + 1].length} 天</span>
            </div>
            <Calendar
              fullCellRender={(current, { today }: { today: Dayjs }) => {
                const isDutyDay = dutyDays['2025'][current.month() + 1] && dutyDays['2025'][current.month() + 1].includes(current.date());
                const isToday = today.isSame(current, 'day');
                return (
                  <div
                    className={`relative h-16 border-t-2 mx-1 my-[1px] px-2 pt-1 ${isDutyDay ? 'bg-blue-50' : ''} ${
                      isToday ? 'font-medium text-white border-blue-500 bg-blue-500' : 'border-gray-200'
                    }`}
                  >
                    {current.format('DD')}
                    {isDutyDay && (
                      <div className='text-start absolute bottom-1'>
                        <CalendarOutlined />
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <div className='text-[18px] mb-4'>近期咨询记录</div>
            <ChatRecordTable
              pagination={false}
              dataSource={[
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
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
