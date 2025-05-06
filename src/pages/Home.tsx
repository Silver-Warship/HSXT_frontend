import { Divider, Space, Image, Modal, Button } from 'antd';
import HSTitle from '../components/HSTitle';
import ConsultRecord from '../components/ConsultRecord';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HSConsent from '../components/HSConsent';
import { getUserInfo } from '../service/users';
import RunningConsultant from '../components/RunningConsultant';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setUserInfo } from '../store/user/userSlice';
import { PoweroffOutlined } from '@ant-design/icons';

const MyDivider = () => {
  return (
    <div className='px-5 my-3'>
      <Divider />
    </div>
  );
};

const Home = () => {
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

  const { nickname, email } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    getUserInfo('visitor')
      .then((res) => {
        dispatch(setUserInfo(res));
      })
      .catch((e) => {
        console.error('获取用户信息出错', e);
      });
  }, []);

  return (
    <div className='relative'>
      <div className='absolute top-5 right-5 z-50'> 
        <PoweroffOutlined onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}  style={{fontSize: 22}} />
      </div>
      <div> 
      </div> 
      {/* 标题 */}
      <HSTitle title='花狮心途' />
      {/* 用户信息 */}
      <div className='w-full px-5 flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Image preview={false} className='rounded-full' src='/avatar.svg' alt='avatar' width={80} height={80} />
          <div>
            <p className='text-lg mb-1'>{nickname ? nickname : 'loading...'}</p>
            <p className='text-black-second text-sm'>{email ? email : 'loading...'}</p>
          </div>
        </div>
        <Image preview={false} onClick={() => navigate('/user')} src='/edit.svg' alt='edit' width={24} height={24} />
      </div>
      {/* 按钮 */}
      <div className='flex justify-center w-full my-5'>
        <button className='w-[238px] bg-[#C3E006] h-12 rounded-full flex items-center justify-center' onClick={showModal}>
          <Space>
            <Image preview={false} src='/counsel.svg' alt='counsel' width={24} height={24} />
            <p className='text-white text-lg font-bold'>立即开始咨询</p>
          </Space>
        </button>
      </div>
      <MyDivider />
      {/* 进行中的咨询 */}
      <RunningConsultant />
      <MyDivider />
      {/* 咨询记录 */}
      <ConsultRecord />
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
};

export default Home;
