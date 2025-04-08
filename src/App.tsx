import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Auth from './router/Auth';
import StepForm from './pages/MyForm';
import ChooseConsultant from './pages/ChooseConsultant';
import Chat from './pages/Chat/Chat';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#C3E006',
        },
      }}
    >
      <div className='h-screen w-full overflow-hidden'>
        <div className='relative mx-auto h-full w-full max-w-screen-sm bg-[#F5F5F5]'>
          {/* 内容 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #EAF994 0%, rgba(255, 255, 255, 0) 60%)',
            }}
            className='absolute top-0 left-0 h-full w-full z-20 overflow-x-hidden overflow-y-auto pb-3'
          >
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Navigate to='/home' replace />} />
                <Route
                  path='/home'
                  element={
                    <Auth>
                      <Home />
                    </Auth>
                  }
                />
                <Route path='/login' element={<Login />} />
                <Route
                  path='/choose-consultant'
                  element={
                    <Auth>
                      <ChooseConsultant />
                    </Auth>
                  }
                />
                <Route
                  path='/chat/:info'
                  element={
                    <Auth>
                      <Chat />
                    </Auth>
                  }
                />
                <Route path='/form' element={<StepForm />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
