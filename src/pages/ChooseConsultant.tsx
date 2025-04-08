/* eslint-disable @typescript-eslint/no-unused-vars */
import { Flex, Modal, Spin } from 'antd';
import HSTitle from '../components/HSTitle';
import ConsultantCard from '../components/ConsultantCard';
import { useEffect, useState } from 'react';
import request from '../utils/request';
import { useDispatch, useSelector } from 'react-redux';
import { createSession } from '../store/chat/chatSlice';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

export default function ChooseConsultant() {
  const [consultants, setConsultants] = useState<
    {
      name: string;
      avatar: string;
      rate: number;
      intro: string;
      isIdle: boolean;
      uid: string;
    }[]
  >([]);

  useEffect(() => {
    request
      .get<
        {
          uid: string;
          nickname: string;
        }[]
      >('/api/test/getAll')
      .then((res) => {
        setConsultants(
          res.map(({ uid, nickname }) => ({
            name: nickname,
            avatar: '/avatar.png',
            rate: 4.5,
            intro: '精神科医生，擅长心理疾病的诊断和治疗。',
            isIdle: true,
            uid,
          })),
        );
      })
      .catch((e) => console.log(e));
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionID } = useSelector((state: RootState) => state.chat);

  const [receiver, setReceiver] = useState('');

  useEffect(() => {
    if (sessionID && receiver && sessionID !== -1) {
      console.log('sessionID', sessionID);
      // 替换当前页面
      navigate(`/chat/${receiver}-${sessionID}`);
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
          {consultants.map((consultant, index) => (
            <ConsultantCard
              key={index}
              {...consultant}
              onStart={() => {
                setReceiver(consultant.uid);
                dispatch(createSession({ receiverID: Number(consultant.uid) }));
              }}
            />
          ))}
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
}
