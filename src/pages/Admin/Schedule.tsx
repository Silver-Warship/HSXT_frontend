import { getAllDuty } from '@/service/Admin/schedule';
import { PlusOutlined } from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import { Avatar, Button, Calendar, Card, Col, Empty, Form, List, Modal, Row, Spin, Tabs } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

const UserList = ({ dataSource, isConsultant }: { dataSource: BriefInfo[]; isConsultant: boolean }) => {
  return (
    <div className='flex flex-col items-center'>
      {/* <Button className='mb-4' type='primary' icon={<PlusOutlined />}>
        添加{isConsultant ? '咨询师' : '督导'}
      </Button> */}
      <Form
        onFinish={(values) => {
          console.log(values);
        }}
        className='max-w-[300px] w-[50%] flex justify-between'
      >
        <ProFormSelect.SearchSelect
          width={150}
          name='select'
          label=''
          debounceTime={200}
          request={async ({ keyWords = '' }) => {
            return [
              { label: '全部', value: 'all' },
              { label: '未解决', value: 'open' },
              { label: '未解决(已分配)', value: 'assignees' },
              { label: '已解决', value: 'closed' },
              { label: '解决中', value: 'processing' },
            ].filter(({ value, label }) => {
              return value.includes(keyWords) || label.includes(keyWords);
            });
          }}
          placeholder={`添加${isConsultant ? '咨询师' : '督导'}`}
        />
        <Button type='primary' htmlType='submit' icon={<PlusOutlined />}>
          添加
        </Button>
      </Form>
      <div className='px-6 max-h-[650px] overflow-auto w-full flex justify-center'>
        {dataSource.length === 0 ? (
          <Empty />
        ) : (
          <List
            className='w-[80%] ml-auto mr-auto'
            dataSource={dataSource}
            renderItem={({ nickname, discription }) => (
              <List.Item
                actions={[
                  <a
                    onClick={() => {
                      Modal.confirm({
                        title: '确认移除',
                        content: `确定要移除${nickname}吗？`,
                        onOk: () => {
                          console.log('ok');
                        },
                        onCancel: () => {
                          console.log('cancel');
                        },
                      });
                    }}
                    style={{ color: 'red' }}
                    key='delete'
                  >
                    移除
                  </a>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src='/avatar.svg' />}
                  title={nickname}
                  description={
                    <div title={discription} className='line-clamp-1'>
                      {discription}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

type BriefInfo = {
  id: number;
  nickname: string;
  discription: string;
};

const Schedule = () => {
  const [dutyDays, setDutyDays] = useState<{
    data: {
      consultant: number;
      supervisor: number;
    }[];
    year: number;
    month: number;
  } | null>(null);

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentDuty, setCurrentDuty] = useState<{
    consultant: BriefInfo[];
    supervisor: BriefInfo[];
  }>({
    consultant: [
      {
        id: 1,
        nickname: '张三',
        discription: '高级心理咨询师高级心理咨询师高级心理咨询师高级心理咨询师高级心理咨询师高级心理咨询师高级心理咨询师',
      },
      {
        id: 2,
        nickname: '李四',
        discription: '中级软件工程师',
      },
      {
        id: 3,
        nickname: '王五',
        discription: '资深平面设计师',
      },
      {
        id: 4,
        nickname: '赵六',
        discription: '注册会计师',
      },
      {
        id: 5,
        nickname: '孙七',
        discription: '初级营养师',
      },
      {
        id: 6,
        nickname: '周八',
        discription: '高级英语翻译',
      },
      {
        id: 7,
        nickname: '吴九',
        discription: '中医理疗师',
      },
      {
        id: 8,
        nickname: '郑十',
        discription: '健身教练',
      },
      {
        id: 9,
        nickname: '钱十一',
        discription: '小学数学教师',
      },
      {
        id: 10,
        nickname: '孙十二',
        discription: '室内装潢设计师',
      },
      {
        id: 11,
        nickname: '李十三',
        discription: '数据分析师',
      },
      {
        id: 12,
        nickname: '周十四',
        discription: '市场运营专员',
      },
      {
        id: 13,
        nickname: '吴十五',
        discription: '人力资源主管',
      },
      {
        id: 14,
        nickname: '郑十六',
        discription: '产品经理',
      },
      {
        id: 15,
        nickname: '王十七',
        discription: '网页前端开发工程师',
      },
      {
        id: 16,
        nickname: '张十八',
        discription: '电气工程师',
      },
      {
        id: 17,
        nickname: '陈十九',
        discription: '园林设计师',
      },
      {
        id: 18,
        nickname: '杨二十',
        discription: '咖啡师',
      },
      {
        id: 19,
        nickname: '黄二十一',
        discription: '摄影师',
      },
      {
        id: 20,
        nickname: '许二十二',
        discription: '美容师',
      },
    ],
    supervisor: [],
  });

  const getDutyDays = async (year: number, month: number) => {
    try {
      const res = await getAllDuty(year, month);
      setDutyDays({
        data: res.orderList.map(({ supervisorNumber: supervisor, counsellorNumber: consultant }) => ({
          consultant,
          supervisor,
        })),
        year: year,
        month: month,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDutyDays(dayjs().year(), dayjs().month() + 1);
  }, []);

  return (
    <>
      <Card>
        <Row>
          <Col span={16} className='relative'>
            <Spin size='large' spinning={!dutyDays}>
              <Calendar
                validRange={[dayjs().subtract(2, 'month').startOf('month'), dayjs().add(2, 'month').endOf('month')]}
                onChange={async (item) => {
                  if (!(item.year() === dutyDays?.year && item.month() + 1 === dutyDays.month)) {
                    setDutyDays(null);
                    await getDutyDays(item.year(), item.month() + 1);
                  }
                  setSelectedDate(item);
                }}
                cellRender={(current) => {
                  if (!dutyDays) {
                    return;
                  }
                  const year = current.year();
                  const month = current.month() + 1;
                  const day = current.date();
                  const duty = dutyDays.year === year && dutyDays.month === month && dutyDays.data[day - 1];
                  if (duty) {
                    return (
                      <Row className='p-2 text-base text-black-second' gutter={[0, 8]}>
                        <Col span={16}>咨询师</Col>
                        <Col span={8}>{duty.consultant}</Col>
                        <Col span={16}>督导</Col>
                        <Col span={8}>{duty.supervisor}</Col>
                      </Row>
                    );
                  } else {
                    return;
                  }
                }}
              />
            </Spin>
          </Col>
          <Col span={8}>
            <div className='mb-4 text-center text-2xl font-medium text-black-second'>
              {selectedDate ? selectedDate.format('MM月DD日 dddd') : '请选择日期'}
            </div>
            <Spin size='large' spinning={!dutyDays}>
              <Tabs
                defaultActiveKey='1'
                centered
                items={[
                  {
                    key: '1',
                    label: '咨询师',
                    children: <UserList dataSource={currentDuty.consultant} isConsultant={true} />,
                  },
                  {
                    key: '2',
                    label: '督导',
                    children: <UserList dataSource={currentDuty.supervisor} isConsultant={false} />,
                  },
                ]}
              />
            </Spin>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Schedule;
