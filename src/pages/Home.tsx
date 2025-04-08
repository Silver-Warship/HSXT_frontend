import { Divider, Flex, Space, Image, Modal } from 'antd';
import HSTitle from '../components/HSTitle';
import ConsultRecordCard from '../components/ConsultRecordCard';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HSConsent from '../components/HSConsent';
import { getUserInfo } from '../service/users';
import RunningConsultant from '../components/RunningConsultant';
import { getRunningSession } from '../service/session';

export default function Home() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timer, setTimer] = useState(5);

  const showModal = () => {
    setTimer(5);
    setIsModalVisible(true);
    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(intervalId);
          return prev;
        }
      });
    }, 1000);
  };

  const [runningSession, setRunningSession] = useState<
    {
      sessionID: number;
      firstUserID: number;
      secondUserID: number;
    }[]
  >([]);

  useEffect(() => {
    try {
      const userID = JSON.parse(localStorage.getItem('user') ?? '{}').uid;
      getUserInfo().then((res) => {
        console.log('getUserInfo', res);
        localStorage.setItem('user', JSON.stringify(res));
      });
      getRunningSession({ userID }).then((res) => {
        console.log('getRunningSession', res);
        setRunningSession(res.sessions);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div>
      {/* 标题 */}
      <HSTitle title='花狮心途' />
      {/* 用户信息 */}
      <div className='w-full px-5 flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Image className='rounded-full' src='/avatar.svg' alt='avatar' width={80} height={80} />
          <div>
            <p className='text-blackFirst text-lg mb-1'>用户001</p>
            <p className='text-blackSecond text-sm'>123****4567</p>
          </div>
        </div>
        <Image src='/edit.svg' alt='edit' width={24} height={24} />
      </div>
      {/* 按钮 */}
      <div className='flex justify-center w-full my-5'>
        <button className='w-[238px] bg-[#C3E006] h-12 rounded-full flex items-center justify-center' onClick={showModal}>
          <Space>
            <Image src='/counsel.svg' alt='counsel' width={24} height={24} />
            <p className='text-white text-lg font-bold'>立即开始咨询</p>
          </Space>
        </button>
      </div>
      <div className='px-5 my-3'>
        <Divider />
      </div>
      {/* 进行中的咨询 */}
      <div className='w-full px-5'>
        {/* header */}
        <div className='mb-4 flex justify-between items-center'>
          <p>进行中的咨询</p>
        </div>
        {/* 卡片列表 */}
        <Flex vertical gap={8}>
          {runningSession.map((item, index) => (
            <RunningConsultant info={item} key={index} />
          ))}
        </Flex>
      </div>
      <div className='px-5 my-3'>
        <Divider />
      </div>
      {/* 咨询记录 */}
      <div className='w-full px-5'>
        {/* header */}
        <div className='mb-4 flex justify-between items-center'>
          <p>咨询记录</p>
          <Space>
            <Image src='/filter.svg' alt='filter' width={24} height={24} />
            <p className='text-blackSecond'>筛选</p>
          </Space>
        </div>
        {/* 卡片列表 */}
        <Flex vertical gap={8}>
          {[].map((_, index) => (
            <ConsultRecordCard key={index} />
          ))}
        </Flex>
      </div>
      {/* 模态框 */}
      <Modal
        title='花狮心途心理咨询服务平台知情同意书'
        open={isModalVisible}
        okText={`我同意 (${timer})`}
        onOk={() => {
          setIsModalVisible(false);
          navigate('/choose-consultant');
        }}
        cancelText='不同意'
        onCancel={() => {
          setIsModalVisible(false);
        }}
        okButtonProps={{ disabled: timer > 0 }}
        classNames={{
          body: 'max-h-[66vh] overflow-y-auto',
        }}
      >
        <HSConsent />
      </Modal>
    </div>
  );
}
