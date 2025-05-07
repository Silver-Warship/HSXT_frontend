import { ROLE_MAP } from '@/layouts/AdminLayout';
import { addConsultantDuty, addSupervisorDuty, deleteConsultantDuty, deleteSupervisorDuty, getAllDuty, getDayDuty } from '@/service/Admin/schedule';
import { fuzzySearch, getAllAllConsultant, getAllConsultant, getAllSupervisor, UserInfo } from '@/service/Admin/user';
import { PlusOutlined } from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import { Avatar, Button, Calendar, Card, Col, Empty, Form, List, message, Modal, Row, Spin, Tabs } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

const UserList = ({
  refresh,
  dataSource,
  isConsultant,
  list,
  today,
}: {
  refresh: () => void;
  dataSource?: BriefInfo[];
  isConsultant: boolean;
  list: Option[];
  today: Dayjs;
}) => {
  const [form] = Form.useForm();
  const cnName = isConsultant ? '咨询师' : '督导';

  return (
    <div className='flex flex-col items-center'>
      {/* <Button className='mb-4' type='primary' icon={<PlusOutlined />}>
        添加{isConsultant ? '咨询师' : '督导'}
      </Button> */}
      <Form
        form={form}
        onFinish={async ({ select: { value } }) => {
          try {
            if (isConsultant) await addConsultantDuty(today, value);
            else await addSupervisorDuty(today, value);
            message.success('添加成功！');
            refresh();
          } catch (e) {
            message.error('添加失败！');
            console.log(e);
          } finally {
            form.resetFields();
          }
        }}
        className='max-w-[300px] w-[50%] flex justify-between'
      >
        <ProFormSelect.SearchSelect
          width={150}
          name='select'
          label=''
          debounceTime={200}
          // options={list}
          request={async ({ keyWords = '' }) => {
            const res = await fuzzySearch(keyWords, isConsultant ? 'counsellor' : 'supervisor');
            return res.infos.map(({ id, nickname }) => ({
              label: `${id} ${nickname}`,
              value: id,
            }));
          }}
          placeholder={`添加${cnName}`}
          mode='single'
          rules={[{ required: true, message: `请选择${cnName}` }]}
        />
        <Button className='ml-2' type='primary' htmlType='submit' icon={<PlusOutlined />}>
          添加
        </Button>
      </Form>
      <div className='px-6 max-h-[650px] overflow-auto w-full flex justify-center'>
        {!dataSource ? (
          <></>
        ) : dataSource.length === 0 ? (
          <Empty />
        ) : (
          <List
            className='w-[80%] ml-auto mr-auto'
            dataSource={dataSource}
            renderItem={({ nickname, email, arrangeID, role }) => (
              <List.Item
                actions={[
                  <a
                    onClick={() => {
                      Modal.confirm({
                        title: '确认移除',
                        content: `确定要移除${nickname}吗？`,
                        onOk: async () => {
                          try {
                            if (role === 'supervisor') await deleteSupervisorDuty(arrangeID);
                            if (role === 'counsellor') await deleteConsultantDuty(arrangeID);
                            message.success('移除成功！');
                            refresh();
                          } catch (e) {
                            message.error('移除失败！');
                            console.log(e);
                          }
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
                    <div title={email} className='line-clamp-1'>
                      {email}
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
  email: string;
  gender: string;
  avater: null | string;
  arrangeID: number;
  role: string;
};

type Option = {
  value: number;
  label: string;
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
  const [currentDuty, setCurrentDuty] = useState<{
    consultant: BriefInfo[];
    supervisor: BriefInfo[];
  } | null>(null);

  const getDutyDays = async (day: Dayjs) => {
    try {
      const year = day.year();
      const month = day.month() + 1;
      const res = await getAllDuty(day);
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

  const getDutyDetail = async (day: Dayjs) => {
    setCurrentDuty(null);
    const counsellor = await getDayDuty(day, 'counsellor');
    const supervisor = await getDayDuty(day, 'supervisor');
    setCurrentDuty({
      consultant: counsellor.info,
      supervisor: supervisor.info,
    });
  };

  const fetchData = (day: Dayjs) => {
    getDutyDays(day);
    getDutyDetail(day);
  };

  useEffect(() => {
    // 获取排班数据
    fetchData(dayjs());

    // const mymap = (info: UserInfo[]) => {
    //   return info.map(({ id, nickname }) => ({
    //     value: id,
    //     label: `${id} ${nickname}`,
    //   }));
    // };
    // 从缓存里拿所有的咨询师和督导列表
    // const allSupervisorTmp = localStorage.getItem('allSupervisor');
    // const allConsultantTmp = localStorage.getItem('allConsultant');
    // if (allSupervisorTmp) {
    //   setAllSupervisor(JSON.parse(allSupervisorTmp));
    // }
    // if (allConsultantTmp) {
    //   setAllConsultant(JSON.parse(allConsultantTmp));
    // }

    // // 发送请求更新状态和缓存
    // Promise.all([getAllSupervisor(), getAllAllConsultant()])
    //   .then(([supRes, conRes]) => {
    //     const supList = mymap(supRes.infos);
    //     const conList = mymap(conRes.infos);

    //     // setAllSupervisor(supList);
    //     localStorage.setItem('allSupervisor', JSON.stringify(supList));

    //     // setAllConsultant(conList);
    //     localStorage.setItem('allConsultant', JSON.stringify(conList));
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
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
                    await getDutyDays(item);
                  }
                  setSelectedDate((prev) => {
                    if (prev.isSame(item, 'date')) return prev;
                    else {
                      getDutyDetail(item);
                      return item;
                    }
                  });
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
            <Spin size='large' spinning={!currentDuty}>
              <Tabs
                defaultActiveKey='1'
                centered
                items={[
                  {
                    key: '1',
                    label: '咨询师',
                    children: (
                      <UserList
                        refresh={() => {
                          fetchData(selectedDate);
                        }}
                        dataSource={currentDuty?.consultant}
                        isConsultant={true}
                        list={[]}
                        today={selectedDate}
                      />
                    ),
                  },
                  {
                    key: '2',
                    label: '督导',
                    children: (
                      <UserList
                        refresh={() => {
                          fetchData(selectedDate);
                        }}
                        dataSource={currentDuty?.supervisor}
                        isConsultant={false}
                        list={[]}
                        today={selectedDate}
                      />
                    ),
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
