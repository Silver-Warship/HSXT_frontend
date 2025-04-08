// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import '@ant-design/v5-patch-for-react-19';
import { register } from './store/chat/chatSlice';
import { Provider } from 'react-redux';
import store from './store/store.ts';

// 假设这里获取到了 WebSocket 连接地址和用户 ID
const wsUrl = import.meta.env.VITE_APP_WS_URL;
const userId = JSON.parse(localStorage.getItem('user') ?? '{}').uid;

console.log(wsUrl, userId);

// 在渲染应用之前，派发 register action
if (wsUrl && userId) {
  store.dispatch(register({ url: wsUrl, userID: userId }));
}

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );
