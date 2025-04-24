import { Rate, Space, Image, Flex } from 'antd';

export default function ConsultRecord() {
  return (
    <div className='w-full px-5'>
      {/* header */}
      <div className='mb-4 flex justify-between items-center'>
        <p>咨询记录</p>
        <Space>
          <Image preview={false} src='/filter.svg' alt='filter' width={24} height={24} />
          <p className='text-black-second'>筛选</p>
        </Space>
      </div>
      {/* 卡片列表 */}
      <Flex vertical gap={8}>
        {[].map((_, index) => (
          <div key={index} className='rounded-xl px-3 py-4 bg-white'>
            <div className='mb-4 flex h-16 gap-4'>
              <Image preview={false} className='rounded-full border-text-black-fifth border' src='/avatar.svg' alt='avatar' width={64} height={64} />
              <div className='h-full flex flex-col justify-around'>
                {/* 咨询师 */}
                <Space>
                  <Image preview={false} src='/consultant.svg' alt='consultant' width={24} height={24} />
                  <p>咨询师</p>
                </Space>
                {/* 咨询时间 */}
                <Space>
                  <Image preview={false} src='/time.svg' alt='time' width={24} height={24} />
                  <Space size='middle'>
                    <p>55min</p>
                    <p className='text-black-third'>2/17 12:05-13:00</p>
                  </Space>
                </Space>
              </div>
            </div>
            {/* 我的评价 */}
            <div className='mb-3 flex flex-row gap-4 items-center'>
              <p>我的评价</p>
              <Rate disabled allowHalf defaultValue={2} />
            </div>
            {/* 按钮组 */}
            <div className='flex justify-end gap-2'>
              <button className='border border-text-black-fourth rounded-full px-4 leading-6 text-black-second'>重新评价</button>
              <button className='bg-themeGreen text-white rounded-full px-4 leading-6 font-semibold'>再次咨询</button>
            </div>
          </div>
        ))}
      </Flex>
    </div>
  );
}
