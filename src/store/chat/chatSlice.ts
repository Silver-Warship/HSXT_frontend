/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

// 定义初始状态
interface ChatState {
  isConnected: boolean;
  messageList: UserMessage[];
  sessionID: number;
  userID: number;
  receiverID: number;
  isSessionClosed: boolean;
}

const initialState: ChatState = {
  isConnected: false,
  messageList: [],
  sessionID: -1,
  userID: -1,
  receiverID: -1,
  isSessionClosed: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // 注册连接
    register(state, action: PayloadAction<{ url: string; userID: number }>) {
      state.userID = action.payload.userID;
    },
    clearMessage(state) {
      state.messageList = [];
    },
    // 创建会话
    createSession(state, action: PayloadAction<{ receiverID: number }>) {
      state.messageList = [];
      state.receiverID = action.payload.receiverID;
      state.isSessionClosed = false;
    }, // 走中间件
    initSession(state, action: PayloadAction<{ sessionID: number; receiverID: number }>) {
      const { sessionID, receiverID } = action.payload;
      state.sessionID = sessionID;
      state.receiverID = receiverID;
      state.isSessionClosed = false;
    },
    // 设置会话ID，仅被中间件使用
    setInfo(state, action: PayloadAction<{ sessionID: number }>) {
      state.sessionID = action.payload.sessionID;
    },
    // 成功连接websocket
    _webSocketConnected(state) {
      state.isConnected = true;
      console.log('WebSocket is connected');
    },
    // websocket关闭
    _webSocketClosed(state, action: PayloadAction<{ code: number }>) {
      state.isConnected = false;
      message.info('WebSocket closed');
      console.error(`WebSocket closed with code ${action.payload.code}`);
    },
    _webSocketError(state, action: PayloadAction<{ event: Event }>) {
      state.isConnected = false;
      console.error('WebSocket error:', action.payload.event);
    },
    // 将消息列表追加到messageList中
    concatMessageList(state, action: PayloadAction<UserMessage[]>) {
      state.messageList = [...state.messageList, ...action.payload];
    },
    // 用户发送一条消息
    sendMessage(
      state,
      action: PayloadAction<{
        content: string;
        contentType: ContentTypes;
      }>,
    ) {}, // 走中间件
    // 将用户发送的消息状态更新为success
    _updateMessageStatus(state, action: PayloadAction<{ seq: string; messageID: number }>) {
      state.messageList = state.messageList.map((item) =>
        item.seq === action.payload.seq ? { ...item, messageID: action.payload.messageID, status: 'success' } : item,
      );
    },
    // 会话被动关闭
    sessionClosed(state) {
      state.sessionID = -1;
      state.receiverID = -1;
      state.messageList = [];
      state.isSessionClosed = true;
      message.info('会话已关闭！');
    },
    sessionClosedFail() {
      message.error('关闭会话失败！');
    },
    // 用户主动关闭会话
    shutDownSession(state, action: PayloadAction<{ sessionID: number }>) {},
  },
});

export const {
  _webSocketConnected,
  _webSocketClosed,
  _webSocketError,
  initSession,
  sendMessage,
  concatMessageList,
  _updateMessageStatus,
  setInfo,
  register,
  createSession,
  sessionClosed,
  shutDownSession,
} = chatSlice.actions;

export default chatSlice.reducer;
