import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { Authed } from './router/Auth';
import ChooseConsultant from './pages/ChooseConsultant';
import Chat from './pages/Chat';
import UserProfile from './pages/UserProfile';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import ChatRecord from './pages/Admin/ChatRecord';
import Session from './pages/Admin/Session';
import ManageSupervisor from './pages/Admin/ManageSupervisor';
import ManageConsultant from './pages/Admin/ManageConsultant';
import ManageVisitor from './pages/Admin/ManageVisitor';
import Schedule from './pages/Admin/Schedule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* C端 */}
        <Route element={<UserLayout />}>
          <Route path='/' element={<Navigate to='/home' replace />} />
          {/* 首页 */}
          <Route path='/home' element={Authed(<Home />)} />
          {/* 登录页 */}
          <Route path='/login' element={<Login />} />
          {/* 用户信息编辑页 */}
          <Route path='/user' element={Authed(<UserProfile />)} />
          {/* 咨询师选择页 */}
          <Route path='/choose-consultant' element={Authed(<ChooseConsultant />)} />
          {/* 聊天页 */}
          <Route path='/chat/:info' element={Authed(<Chat />)} />
          <Route path='*' element={<NotFound />} />
        </Route>

        {/* B端 */}
        <Route path='admin'>
          <Route index element={<Navigate to='/admin/dashboard' replace />} />
          {/* 登录页 */}
          <Route
            path='login'
            element={
              <div className="h-[100vh] bg-[url('/admin_login_bg.png')] bg-[100%]">
                <Login />
              </div>
            }
          />
          {/* 首页 */}
          <Route element={<AdminLayout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='record' element={<ChatRecord />} />
            <Route path='session/:id' element={<Session />} />
            <Route path='manage-supervisor' element={<ManageSupervisor />} />
            <Route path='manage-consultant' element={<ManageConsultant />} />
            <Route path='manage-visitor' element={<ManageVisitor />} />
            <Route path='schedule' element={<Schedule />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
