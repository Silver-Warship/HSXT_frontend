// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@ant-design/v5-patch-for-react-19';
import { register } from './store/chat/chatSlice';
import { Provider } from 'react-redux';
import store, { persistor } from './store/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

// 假设这里获取到了 WebSocket 连接地址和用户 ID
const wsUrl = import.meta.env.VITE_APP_WS_URL;

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate
      loading={null}
      persistor={persistor}
      onBeforeLift={() => {
        const { uid } = store.getState().user;
        console.log(wsUrl, uid);
        // 在状态恢复后，派发 register action
        if (wsUrl && uid) {
          store.dispatch(register({ url: wsUrl, userID: Number(uid) }));
        }
      }}
    >
      <App />
    </PersistGate>
  </Provider>,
);

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );
