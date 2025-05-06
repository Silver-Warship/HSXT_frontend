/* eslint-disable @typescript-eslint/no-unused-vars */
import { Flex, Modal, Spin } from 'antd';
import HSTitle from '../components/HSTitle';
import ConsultantCard from '../components/ConsultantCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSession } from '../store/chat/chatSlice';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { CounsullerInfo, getAllConsultant } from '@/service/Admin/user';

const ChooseConsultant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionID } = useSelector((state: RootState) => state.chat);
  const { uid } = useSelector((state: RootState) => state.user);
  const [consultants, setConsultants] = useState<
    {
      name: string;
      avatar: string;
      rate: number;
      intro: string;
      isIdle: boolean;
      uid: string;
    }[]
  >();

  const [receiver, setReceiver] = useState('');

  const fetchData = async () => {
    const infos = await getAllConsultant();
    setConsultants(
      infos.counsellors.map(( info :  CounsullerInfo ) => ({
        name: info.nickname,
        avatar: "/avatar.svg",
        rate: Math.random() * 5,
        intro: info.selfAppraisal,
        isIdle: true,
        uid: String(info.counsellorID),
      })),
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (sessionID && receiver && sessionID !== -1) {
      // 替换当前页面
      navigate(`/chat/${uid}-${receiver}-${sessionID}`);
    }
  }, [sessionID, receiver]);

  return (
    <div>
      {/* 标题 */}
      <HSTitle title='选择咨询师' canBack />
      {/* 咨询师 */}
      <div className='w-full px-5'>
        {/* 卡片列表 */}
        <Flex vertical gap={8}>
          {/* 空白卡片 */}
          <ConsultantCard
                {...{ name: 'Kimi', uid: '-1', isIdle: true, rate: 5, onStart: () => {} }}
                onStart={() => {
                  navigate('/GptChat');
                }}
          />

          {!consultants ? (
            <Spin size='large' />
          ) : (
            consultants.map((consultant, index) => (
              <ConsultantCard
                key={index}
                {...consultant}
                onStart={() => {
                  setReceiver(consultant.uid);
                  dispatch(createSession({ receiverID: Number(consultant.uid) }));
                }}
              />
            ))
          )}
        </Flex>
      </div>
      <Modal
        title='会话创建中'
        classNames={{
          header: 'text-center',
          body: 'text-center',
        }}
        centered
        maskClosable={false}
        closable={false}
        footer={null}
        open={receiver !== ''}
        width={180}
      >
        <div className='h-4'></div>
        <Spin size='large' />
      </Modal>
    </div>
  );
};

export default ChooseConsultant;
