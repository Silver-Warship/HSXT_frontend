import { Rate, Space, Image } from 'antd';

export default function ConsultRecordCard() {
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
      {/* 我的评价 */}
      <div className='mb-3 flex flex-row gap-4 items-center'>
        <p>我的评价</p>
        <Rate disabled defaultValue={2} />
      </div>
      {/* 按钮组 */}
      <div className='flex justify-end gap-2'>
        <button className='border border-blackFourth rounded-full px-4 leading-6 text-blackSecond'>重新评价</button>
        <button className='bg-themeGreen text-white rounded-full px-4 leading-6 font-semibold'>再次咨询</button>
      </div>
    </div>
  );
}
