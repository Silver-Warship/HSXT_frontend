import { DualAxes } from '@ant-design/charts';
import { BellTwoTone, CalendarOutlined, CheckCircleTwoTone, ClockCircleTwoTone, LikeTwoTone, StarTwoTone } from '@ant-design/icons';
import { Calendar, Card, Col, Row, Statistic } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const dutyDays: {
  [year: number]: {
    [month: number]: number[];
  };
} = {
  2025: {
    4: [1, 13, 25],
    5: [2, 14, 26],
  },
};

const Dashboard = () => {
  const uvData = [
    { time: '2019-03', value: 35 },
    { time: '2019-04', value: 90 },
    { time: '2019-05', value: 30 },
    { time: '2019-06', value: 45 },
    { time: '2019-07', value: 47 },
  ];

  const transformData = [
    { time: '2019-03', count: 800, name: 'a' },
    { time: '2019-04', count: 600, name: 'a' },
    { time: '2019-05', count: 400, name: 'a' },
    { time: '2019-06', count: 380, name: 'a' },
    { time: '2019-07', count: 220, name: 'a' },
    { time: '2019-03', count: 750, name: 'b' },
    { time: '2019-04', count: 650, name: 'b' },
    { time: '2019-05', count: 450, name: 'b' },
    { time: '2019-06', count: 400, name: 'b' },
    { time: '2019-07', count: 320, name: 'b' },
    { time: '2019-03', count: 900, name: 'c' },
    { time: '2019-04', count: 600, name: 'c' },
    { time: '2019-05', count: 450, name: 'c' },
    { time: '2019-06', count: 300, name: 'c' },
    { time: '2019-07', count: 200, name: 'c' },
  ];

  const config = {
    xField: 'time',
    legend: true,
    scale: { color: { range: ['#1783FF', '#5AD8A6', '#5D7092', '#F6BD16'] } },
    interaction: { tooltip: { sort: (d: { name: string }) => ['value', 'a', 'b', 'c'].indexOf(d.name) } },
    children: [
      {
        data: uvData,
        type: 'interval',
        yField: 'value',
        style: { maxWidth: 80 },
      },
      {
        data: transformData,
        type: 'line',
        yField: 'count',
        colorField: 'name',
        seriesField: 'name',
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
            <Col span={8}>
              <Card variant='borderless'>
                <Statistic
                  title='当前综合评价'
                  value={4.23}
                  precision={2}
                  prefix={<StarTwoTone twoToneColor='#fdd90d' className='text-[#fdd90d]' />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card variant='borderless'>
                <Statistic title='今日已完成咨询数' value={12} prefix={<CheckCircleTwoTone twoToneColor='#52c41a' />} />
              </Card>
            </Col>
            <Col span={8}>
              <Card variant='borderless'>
                <Statistic title='今日咨询总时长' value={'12:30:20'} prefix={<ClockCircleTwoTone />} />
              </Card>
            </Col>
            <Col span={8}>
              <Card variant='borderless'>
                <Statistic title='进行中的咨询' value={3} prefix={<BellTwoTone twoToneColor='#eb2f96' />} />
              </Card>
            </Col>
            <Col span={8}>
              <Card variant='borderless'>
                <Statistic title='累计完成咨询' value={132} prefix={<LikeTwoTone twoToneColor='#52c41a' />} />
              </Card>
            </Col>
            <Col span={8}>
              <Card variant='borderless'>
                <Statistic title='累计完成咨询' value={132} prefix={<LikeTwoTone twoToneColor='#52c41a' />} />
              </Card>
            </Col>
            <Col style={{ display: 'flex' }} span={24}>
              <Card className='h-full w-full'>
                <DualAxes height={250} {...config} />
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
                    className={`relative h-16 border-t-2 mx-1 my-[1px] px-2 pt-1 ${
                      isDutyDay ? (isToday ? 'font-medium text-white border-blue-500 bg-blue-500' : 'bg-blue-50 border-gray-200') : 'border-gray-200'
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
      </Row>
    </>
  );
};

export default Dashboard;
