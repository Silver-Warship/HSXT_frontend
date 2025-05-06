import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { Authed, AdminAuthed } from './router/Auth';
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
import HelpRecord from './pages/Admin/HelpRecord';
import GptChat from './pages/GptChat';

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
          <Route path='GptChat' element={Authed(<GptChat/>)} />
        </Route>

        {/* B端 */}
        <Route path='admin'>
          <Route index element={<Navigate to='/admin/dashboard' replace />} />
          {/* 登录页 */}
          <Route
            path='login'
            element={
              <div className="h-[100vh] bg-[url('/admin_login_bg.png')] bg-[100%]">
                <Login isAdmin={true} />
              </div>
            }
          />
          {/* 首页 */}
          <Route element={<AdminLayout />}>
            <Route path='dashboard' element={AdminAuthed(<Dashboard />)} />
            <Route path='record' element={AdminAuthed(<ChatRecord />)} />
            <Route path='help-record' element={AdminAuthed(<HelpRecord />)} />
            <Route path='session/:info' element={AdminAuthed(<Session />)} />
            <Route path='manage-supervisor' element={AdminAuthed(<ManageSupervisor />)} />
            <Route path='manage-consultant' element={AdminAuthed(<ManageConsultant />)} />
            <Route path='manage-visitor' element={AdminAuthed(<ManageVisitor />)} />
            <Route path='schedule' element={AdminAuthed(<Schedule />)} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
