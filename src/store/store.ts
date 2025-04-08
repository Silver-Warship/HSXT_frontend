import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chat/chatSlice';
import chatMiddleware from './chat/chatMiddleware';

const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(chatMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
