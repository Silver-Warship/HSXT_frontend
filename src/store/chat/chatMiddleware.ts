import { Middleware } from '@reduxjs/toolkit';
import { _webSocketConnected, _webSocketError, concatMessageList, _updateMessageStatus, setInfo, _webSocketClosed, sessionClosed } from './chatSlice';
import HSTime from '../../utils/time';
import { message as antdMessage } from 'antd';

const isChatRegisterAction = (action: unknown): action is { type: 'chat/register'; payload: { url: string; userID: number } } => {
  return typeof action === 'object' && action !== null && 'type' in action && action.type === 'chat/register';
};

const isChatCreateSessionAction = (action: unknown): action is { type: 'chat/createSession'; payload: { receiverID: number } } => {
  return typeof action === 'object' && action !== null && 'type' in action && action.type === 'chat/createSession';
};

const isChatSendMessageAction = (
  action: unknown,
): action is { type: 'chat/sendMessage'; payload: { content: string; contentType: ContentTypes } } => {
  return typeof action === 'object' && action !== null && 'type' in action && action.type === 'chat/sendMessage';
};

const isShutDownSessionAction = (action: unknown): action is { type: 'chat/shutDownSession'; payload: { sessionID: number } } => {
  return typeof action === 'object' && action !== null && 'type' in action && action.type === 'chat/shutDownSession';
};

const chatMiddleware: Middleware = (store) => {
  let socket: WebSocket | null = null;
  let reconnectCount = 0;
  const reconnectInterval = 1000;
  const reconnectAttempts = 10000000000;
  const requestPool: {
    seq: string;
    type: MessageTypes;
  }[] = []; // 请求池

  let heartbeatInterval: number | null = null;

  const startHeartbeat = () => {
    heartbeatInterval = setInterval(() => {
      _send({
        type: 'Heartbeat',
        data: null,
      });
    }, 10000); // 每10秒发一次
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  };

  const connect = (url: string) => {
    socket = new WebSocket(url);

    socket.onopen = () => {
      store.dispatch(_webSocketConnected());
      register();
      if (store.getState().chat.sessionID !== -1) {
        requestMsg();
      }
      startHeartbeat(); // 开始心跳包
    };

    socket.onclose = (event) => {
      store.dispatch(_webSocketClosed({ code: event.code }));
      stopHeartbeat(); // 停止心跳包
      if (reconnectCount < reconnectAttempts) {
        setTimeout(() => {
          reconnectCount++;
          connect(url);
        }, reconnectInterval);
      }
    };

    socket.onerror = (event) => {
      store.dispatch(_webSocketError({ event }));
      stopHeartbeat(); // 停止心跳包
    };

    socket.onmessage = (event) => {
      console.log('收到消息', event.data);
      const message: ReceiveMessage.Response = JSON.parse(event.data);
      const sessionID = store.getState().chat.sessionID;
      if (message.seq === 'type-newMessage') {
        console.log('有新消息！', message, sessionID);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((message as any).data.sessionID !== sessionID) return;
        // 无seq，为服务器主动推送的新消息
        const {
          data: { content, contentType, messageID, timestamp },
        } = message as unknown as {
          code: number;
          codeMsg: string;
          data: {
            content: string;
            contentType: ContentTypes;
            messageID: number;
            timestamp: number;
          };
        };
        store.dispatch(
          concatMessageList([
            {
              role: 0,
              content,
              contentType,
              messageID,
              timestamp,
              status: 'success',
            },
          ]),
        );
        ackMsg([messageID]);
        return;
      } else if (message.seq === 'type-sessionClose') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((message as any).data.sessionID !== sessionID) return;
        store.dispatch(sessionClosed());
      } else {
        removeSeq(message);
      }
    };
  };

  // 将序列号加入请求池
  const addSeq = (type: MessageTypes) => {
    // 获取序列号
    const seq = `${HSTime.timestamp()}${Math.ceil(Math.random() * 10000)}`;
    requestPool.push({ seq, type });
    return seq;
  };

  // 移除序列号，执行回调函数
  const removeSeq = (message: ReceiveMessage.Response) => {
    const { seq } = message;
    const index = requestPool.findIndex((item) => item.seq === seq);
    if (index === -1) return;
    const { type } = requestPool[index];

    switch (type) {
      case 'sendMsg':
        handleSendMsgResponse(message as ReceiveMessage.SendMsgResponse);
        break;
      case 'requestMsg':
        handleRequestMsgResponse(message as ReceiveMessage.RequestMsgResponse);
        break;
      case 'createSession':
        handleCreateSessionResponse(message as ReceiveMessage.createSessionResponse);
        break;
      case 'closeSession':
        handleCloseSessionResponse(message as ReceiveMessage.CloseSessionResponse);
        break;
      default:
        break;
    }

    requestPool.splice(index, 1);
  };

  // 用户发送的消息得到确认
  const handleSendMsgResponse = (message: ReceiveMessage.SendMsgResponse) => {
    //处理发送消息的响应
    const {
      seq,
      data: { messageID },
    } = message;
    store.dispatch(_updateMessageStatus({ seq, messageID }));
  };

  // 收到未读的消息列表
  const handleRequestMsgResponse = (message: ReceiveMessage.RequestMsgResponse) => {
    const {
      data: { messages },
    } = message;
    // 更新消息列表
    store.dispatch(
      concatMessageList(
        messages.map((item) => ({
          ...item,
          role: 0,
          status: 'success' as MessageStatus,
        })),
      ),
    );
    // 确认收到消息
    ackMsg(messages.map(({ messageID }) => messageID));
  };

  // 收到创建会话的响应，更新会话ID
  const handleCreateSessionResponse = (message: ReceiveMessage.createSessionResponse) => {
    const {
      data: { sessionID },
    } = message;
    store.dispatch(setInfo({ sessionID }));
  };

  const handleCloseSessionResponse = (message: ReceiveMessage.CloseSessionResponse) => {
    const { data, codeMsg } = message;
    if (!data) antdMessage.info(codeMsg);
  };

  // 通用发送消息函数
  const _send = (message: SendMessage.Message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log(`WebSocket sending message: ${JSON.stringify(message)}`);
      // chunk
      const chunkSize = 2048;
      const content = JSON.stringify(message);
      if (content.length <= chunkSize) {
        socket.send(content);
      } else {
        // send content size first
        socket.send(content.length.toString());
        const chunks = Math.ceil(content.length / chunkSize);
        for (let i = 0; i < chunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, content.length);
          socket.send(content.slice(start, end));
        }
      }
    } else {
      console.error('Cannot send message - WebSocket is not connected');
    }
  };

  // 当前用户发送一条消息
  const sendMsg = (data: { content: string; contentType: ContentTypes }) => {
    const seq = addSeq('sendMsg');
    store.dispatch(
      concatMessageList([
        {
          seq,
          role: 1,
          content: data.content,
          contentType: data.contentType,
          timestamp: HSTime.timestamp(),
          status: 'pending',
        },
      ]),
    );
    const message: SendMessage.SendMsg = {
      type: 'sendMsg',
      seq,
      data: {
        senderID: store.getState().chat.userID,
        sessionID: store.getState().chat.sessionID,
        receiverID: store.getState().chat.receiverID,
        timestamp: HSTime.timestamp(),
        ...data,
      },
    };
    _send(message);
  };

  // 拉取未读消息
  const requestMsg = () => {
    const seq = addSeq('requestMsg');
    const message: SendMessage.RequestMsg = {
      type: 'requestMsg',
      seq,
      data: {
        userID: store.getState().chat.userID,
        sessionID: store.getState().chat.sessionID,
      },
    };
    _send(message);
  };

  // 确认帧
  const ackMsg = (data: number[]) => {
    const seq = addSeq('ackMsg');
    const message: SendMessage.AckMsg = {
      type: 'ackMsg',
      seq,
      data: {
        messageIDs: data,
        ackTimestamp: HSTime.timestamp(),
      },
    };
    _send(message);
  };

  // 关闭会话
  const closeSessionMsg = (sessionID: number) => {
    store.dispatch(setInfo({ sessionID }));
    const seq = addSeq('closeSession');
    _send({
      type: 'closeSession',
      seq,
      data: {
        sessionID: sessionID,
      },
    });
  };

  /** 注册连接 */
  const register = () => {
    const seq = addSeq('registerConnection');
    _send({
      type: 'registerConnection',
      seq,
      data: {
        userID: store.getState().chat.userID,
      },
    });
  };

  const createSession = (receiverID: number) => {
    const seq = addSeq('createSession');
    _send({
      type: 'createSession',
      seq,
      data: {
        firstUserID: store.getState().chat.userID,
        secondUserID: receiverID,
        sessionStartTime: HSTime.timestamp(),
      },
    });
  };

  return (next) => (action) => {
    if (isChatRegisterAction(action) && socket === null) {
      connect(action.payload.url);
    } else if (isChatCreateSessionAction(action)) {
      createSession(action.payload.receiverID);
    } else if (isChatSendMessageAction(action)) {
      sendMsg(action.payload);
    } else if (isShutDownSessionAction(action)) {
      closeSessionMsg(action.payload.sessionID);
    }
    return next(action);
  };
};

export default chatMiddleware;
