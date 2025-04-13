import { ConfigProvider } from 'antd';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#C3E006',
          fontSize: 16,
        },
      }}
    >
      <div className='h-screen w-full overflow-hidden black-first'>
        <div className='relative mx-auto h-full w-full max-w-screen-sm bg-[#F5F5F5]'>
          {/* 内容 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #EAF994 0%, rgba(255, 255, 255, 0) 60%)',
            }}
            className='absolute top-0 left-0 h-full w-full z-20 overflow-x-hidden overflow-y-auto pb-3'
          >
            <Outlet />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default UserLayout;
