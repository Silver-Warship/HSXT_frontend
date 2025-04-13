import { Space, Image, Button, Flex, Empty, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { useEffect, useState } from 'react';
import { getRunningSession } from '../service/session';
import { shutDownSession } from '../store/chat/chatSlice';

export default function RunningConsultant() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sessionID } = useSelector((state: RootState) => state.chat);
  const { uid } = useSelector((state: RootState) => state.user);

  const [runningSession, setRunningSession] = useState<
    {
      sessionID: number;
      firstUserID: number;
      secondUserID: number;
    }[]
  >();

  useEffect(() => {
    try {
      getRunningSession({ userID: Number(uid) }).then((res) => {
        setRunningSession(res.sessions);
      });
    } catch (e) {
      console.log(e);
    }
  }, [uid, sessionID]);

  return (
    <div className='w-full px-5'>
      {/* header */}
      <div className='mb-4 flex justify-between items-center'>
        <p>进行中的咨询</p>
      </div>
      {/* 卡片列表 */}
      <Flex vertical gap={8}>
        {!runningSession ? (
          <Spin size='large' />
        ) : runningSession.length === 0 ? (
          <Empty description='暂无进行中的咨询' />
        ) : (
          runningSession.map(({ sessionID, firstUserID, secondUserID }, index) => (
            <div key={index} className='rounded-xl px-3 py-4 bg-white'>
              <div className='mb-4 flex h-16 gap-4'>
                <Image
                  preview={false}
                  className='rounded-full border-text-black-fifth border'
                  src='/avatar.svg'
                  alt='avatar'
                  width={64}
                  height={64}
                />
                <div className='h-full flex flex-col justify-around'>
                  {/* 咨询师 */}
                  <div className='flex items-center gap-2'>
                    <Image preview={false} src='/consultant.svg' alt='consultant' width={24} height={24} />
                    <p>咨询师{firstUserID === Number(uid) ? secondUserID : firstUserID}</p>
                  </div>
                  {/* 咨询时间 */}
                  <div className='flex items-center gap-2'>
                    <Image preview={false} src='/time.svg' alt='time' width={24} height={24} />
                    <Space size='middle'>
                      <p>开始于</p>
                      <p className='text-black-third'>2/17 12:05-13:00</p>
                    </Space>
                  </div>
                </div>
              </div>
              {/* 按钮组 */}
              <div className='flex justify-end gap-2'>
                <Button
                  onClick={() => {
                    dispatch(shutDownSession({ sessionID }));
                  }}
                >
                  结束咨询
                </Button>
                <Button
                  type='primary'
                  onClick={() => {
                    navigate(`/chat/${uid}-${String(firstUserID) === uid ? secondUserID : firstUserID}-${sessionID}`);
                  }}
                >
                  继续咨询
                </Button>
              </div>
            </div>
          ))
        )}
      </Flex>
    </div>
  );
}
