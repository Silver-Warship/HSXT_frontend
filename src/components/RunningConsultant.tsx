import { Space, Image, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function RunningConsultant({
  info,
}: {
  info: {
    sessionID: number;
    firstUserID: number;
    secondUserID: number;
  };
}) {
  const navigate = useNavigate();
  const { sessionID, firstUserID, secondUserID } = info;
  const userId = JSON.parse(localStorage.getItem('user') ?? '{}').uid;
  const receiverID = String(firstUserID) === String(userId) ? secondUserID : firstUserID;

  return (
    <div className='rounded-xl px-3 py-4 bg-white'>
      <div className='mb-4 flex h-16 gap-4'>
        <Image className='rounded-full border-blackFifth border' src='/avatar.svg' alt='avatar' width={64} height={64} />
        <div className='h-full flex flex-col justify-around'>
          {/* 咨询师 */}
          <Space>
            <Image src='/consultant.svg' alt='consultant' width={24} height={24} />
            <p>咨询师</p>
          </Space>
          {/* 咨询时间 */}
          <Space>
            <Image src='/time.svg' alt='time' width={24} height={24} />
            <Space size='middle'>
              <p>55min</p>
              <p className='text-blackThird'>2/17 12:05-13:00</p>
            </Space>
          </Space>
        </div>
      </div>
      {/* 按钮组 */}
      <div className='flex justify-end gap-2'>
        <Button>结束咨询</Button>
        <Button
          type='primary'
          onClick={() => {
            navigate(`/chat/${receiverID}-${sessionID}`);
          }}
        >
          继续咨询
        </Button>
      </div>
    </div>
  );
}
