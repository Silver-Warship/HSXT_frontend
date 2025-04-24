import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

// const Auth = ({ children }: { children: React.ReactNode }) => {
//   const token = localStorage.getItem('token');
//   const isLoggedIn = token !== 'null' && token;

//   // 如果需要登录但没有 token，重定向到登录页
//   if (isLoggedIn) {
//     return <>{children}</>;
//   } else {
//     return <Navigate to='/login' replace />;
//   }
// };

const Authed = (children: React.ReactNode) => {
  const token = localStorage.getItem('token');
  const isLoggedIn = token && token !== 'null' && token !== 'undefined' && Boolean(token);
  const { usertype } = useSelector((state: RootState) => state.user);

  // 如果需要登录但没有 token，重定向到登录页
  if (isLoggedIn) {
    if (usertype !== 'visitor') return <Navigate to='/admin' replace />;
    return <>{children}</>;
  } else {
    return <Navigate to='/login' replace />;
  }
};

const AdminAuthed = (children: React.ReactNode) => {
  const token = localStorage.getItem('token');
  const isLoggedIn = token && token !== 'null' && token !== 'undefined' && Boolean(token);
  const { usertype } = useSelector((state: RootState) => state.user);

  // 如果需要登录但没有 token，重定向到登录页
  if (isLoggedIn) {
    if (usertype === 'visitor') return <Navigate to='/' replace />;
    return <>{children}</>;
  } else {
    return <Navigate to='/admin/login' replace />;
  }
};

export { Authed, AdminAuthed };
