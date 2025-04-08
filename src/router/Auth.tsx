import { Navigate } from 'react-router-dom';

const Auth = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const isLoggedIn = token !== 'null' && token;

  // 如果需要登录但没有 token，重定向到登录页
  if (isLoggedIn) {
    return <>{children}</>;
  } else {
    return <Navigate to='/login' replace />;
  }
};

export default Auth;
