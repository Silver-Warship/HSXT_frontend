import { Button, Image, Rate, Space } from 'antd';

export default function ConsultantCard({
  name,
  isIdle,
  rate,
  onStart,
}: {
  uid: string;
  name: string;
  isIdle: boolean;
  rate: number;
  onStart: () => void;
}) {
  return (
    <div className='rounded-xl px-3 py-4 bg-white'>
      <div className='mb-4 flex h-16 gap-4'>
        <Image className='rounded-full border-blackFifth border' src='/avatar.svg' alt='avatar' width={64} height={64} />
        <div className='h-full flex flex-col justify-around'>
          {/* 咨询师 */}
          <Space>
            <Image src='/consultant.svg' alt='consultant' width={24} height={24} />
            <p>{name}</p>
          </Space>
          {/* 咨询时间 */}
          <Space>
            <Image src='/time.svg' alt='time' width={24} height={24} />
            <p>空闲</p>
          </Space>
        </div>
      </div>
      {/* 我的评价 */}
      <Space size='middle' className='mb-3 w-full'>
        <p>综合评价</p>
        <Rate disabled allowHalf defaultValue={5} value={rate} />
      </Space>
      {/* 按钮组 */}
      <div className='flex justify-end gap-2'>
        {!isIdle && <button className='border border-blackFourth rounded-full px-4 leading-6 text-blackSecond'>开始排队</button>}
        {/* <button
          className={`${isIdle ? 'bg-themeGreen' : 'bg-blackFourth'} text-white rounded-full px-4 leading-6 font-semibold`}
          disabled={!isIdle}
          onClick={onStart}
        >
          立即咨询
        </button> */}
        <Button type='primary' onClick={onStart}>
          立即咨询
        </Button>
      </div>
    </div>
  );
}
