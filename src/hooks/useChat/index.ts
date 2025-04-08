import { useEffect, useRef, useState } from 'react';
import HSTime from '../../utils/time';

type WebSocketOptions = {
  url: string;
  onOpen?: () => void;
  onClose?: (event: Event) => void;
  onError?: (event: Event) => void;
  onMessage?: (message: ReceiveMessage.Response) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  userID: number;
  receiverID: number;
  sessionID: number;
};

const defaultOptions: Required<WebSocketOptions> = {
  url: '', //连接的长链接
  onOpen: () => {}, //开启连接
  onClose: () => {}, //关闭链接
  onError: () => {}, //异常
  onMessage: () => {}, //消息
  reconnectInterval: 1000, //重连时长设置
  reconnectAttempts: 10, //最大连接范围数
  userID: 0,
  receiverID: 0,
  sessionID: -1,
};

const useChat = (options: WebSocketOptions) => {
  const {
    url,
    onOpen,
    onClose,
    // onError,
    onMessage,
    reconnectInterval,
    reconnectAttempts,
    sessionID,
    userID,
    receiverID,
  } = {
    ...defaultOptions,
    ...options,
  };

  const [isConnected, setIsConnected] = useState(false); //是否连接
  const [reconnectCount, setReconnectCount] = useState(0); //用于判断重连
  const [messageList, setMessageList] = useState<UserMessage[]>([]); //消息列表
  const [, SetRequestPool] = useState<
    {
      seq: string;
      type: MessageTypes;
      callback: (message: ReceiveMessage.Response) => void;
    }[]
  >([]); // 请求池

  const handleSendMsgResponse = (message: ReceiveMessage.SendMsgResponse) => {
    //处理发送消息的响应
    const {
      seq,
      data: { messageID },
    } = message;
    // 找到消息列表中seq相同的消息，更新状态为success
    setMessageList((prevList) => prevList.map((item) => (item.seq === seq ? { ...item, messageID, status: 'success' } : item)));
  };

  // 收到未读的消息列表
  const handleRequestMsgResponse = (message: ReceiveMessage.RequestMsgResponse) => {
    const {
      data: { messages },
    } = message;
    // 更新消息列表
    setMessageList((prevList) => {
      console.log('之前的消息列表', prevList);
      return [
        ...prevList,
        ...messages.map((item) => ({
          ...item,
          role: 0,
          status: 'success' as MessageStatus,
        })),
      ];
    });
    // 确认收到消息
    _ackMsg(messages.map(({ messageID }) => messageID));
  };

  // 服务器发送确认消息确认收到了客户端的确认消息
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAckMsgResponse = (message: ReceiveMessage.AckMsgResponse) => {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRegisterResponse = (message: ReceiveMessage.SendMsgResponse) => {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateSessionResponse = (message: ReceiveMessage.createSessionResponse) => {
    // const {
    //   data: { sessionID },
    // } = message;
    // updateSessionID(sessionID);
  };

  const typeToCallback = {
    sendMsg: handleSendMsgResponse,
    requestMsg: handleRequestMsgResponse,
    ackMsg: handleAckMsgResponse,
    registerConnection: handleRegisterResponse,
    createSession: handleCreateSessionResponse,
  } as const;

  // 将序列号加入请求池
  const addSeq = (type: MessageTypes) => {
    // 获取序列号
    const seq = `${HSTime.timestamp()}${Math.ceil(Math.random() * 10000)}`;
    SetRequestPool((prev) => {
      return [
        ...prev,
        {
          seq,
          type,
          callback: typeToCallback[type] as (message: ReceiveMessage.Response) => void,
        },
      ];
    });
    return seq;
  };

  // 移除序列号，执行回调函数
  const removeSeq = (massage: ReceiveMessage.Response) => {
    //移除序列号
    SetRequestPool((prevPool) => {
      const { seq } = massage;
      const { callback = () => {} } = prevPool.find((item) => item.seq === seq) ?? {};
      console.log('回调函数名字', callback.name);
      callback(massage); // 执行回调函数
      return prevPool.filter((item) => item.seq !== seq);
    });
  };

  const socketRef = useRef<WebSocket>(undefined);
  const reconnectTimerRef = useRef<number>(undefined);

  const connect = () => {
    //连接函数封装
    setIsConnected(false);

    const socket = new WebSocket(url);
    socket.onopen = () => {
      //开始连接
      console.log('WebSocket is connected');
      setIsConnected(true);
      setReconnectCount(0);
      _register(); // TODO: 登录之后立马注册ws连接
      if (sessionID !== -1) {
        // 拉取未读消息
        requestMsg();
      }
      onOpen();
    };
    socket.onclose = (event) => {
      //连接关闭
      console.error(`WebSocket closed with code ${event.code}`);
      setIsConnected(false);
      onClose(event);
      if (reconnectCount < reconnectAttempts) {
        //用于判断断开连接后重新连接
        reconnectTimerRef.current = setTimeout(() => {
          setReconnectCount((prevCount) => prevCount + 1);
          connect();
        }, reconnectInterval);
      }
    };
    socket.onerror = (event) => {
      //异常问题
      console.error('WebSocket error:', event);
      onClose(event);
    };
    socket.onmessage = (event) => {
      const message: ReceiveMessage.Response = JSON.parse(event.data);
      if (message.seq === undefined) {
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
        setMessageList((prevList) => [
          ...prevList,
          {
            role: 0,
            content: content,
            contentType: contentType,
            messageID: messageID,
            timestamp: timestamp,
            status: 'success',
          },
        ]);
        _ackMsg([messageID]); // 确认收到消息
        return;
      }

      console.log('接收到的消息', message);
      // console.log(`WebSocket received message: ${message}`);
      // ackMsg([]); // 确认收到消息，仅在收到requestMsg的响应时调用
      removeSeq(message); //移除序列号，每次收到消息都会调用
      onMessage(message); // 外部定义的额外行为
    };

    socketRef.current = socket;
  };

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.close();
      clearTimeout(reconnectTimerRef.current);
    };
  }, []);

  const _send = (message: SendMessage.Message) => {
    //用于发送消息
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log(`WebSocket sending message: ${JSON.stringify(message)}`);
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error('Cannot send message - WebSocket is not connected');
    }
  };

  const _register = () => {
    //注册函数，用于向服务器发送注册请求
    console.log('registerConnection');
    const seq = addSeq('registerConnection');
    _send({
      type: 'registerConnection',
      seq,
      data: {
        userID,
      },
    });
  };

  const createSession = () => {
    // 创建会话
    console.log('createSession');
    const seq = addSeq('createSession');
    _send({
      type: 'createSession',
      seq,
      data: {
        firstUserID: userID,
        secondUserID: receiverID,
        sessionStartTime: HSTime.timestamp(),
      },
    });
  };

  const sendMsg = (data: { content: string; contentType: ContentTypes }) => {
    const seq = addSeq('sendMsg');
    // 更新消息列表
    setMessageList((prevList) => [
      ...prevList,
      {
        seq,
        role: 1,
        content: data.content,
        contentType: data.contentType,
        timestamp: HSTime.timestamp(),
        status: 'pending',
      },
    ]);
    //发送消息
    const message: SendMessage.SendMsg = {
      type: 'sendMsg',
      seq,
      data: {
        senderID: userID,
        sessionID,
        receiverID,
        timestamp: HSTime.timestamp(),
        ...data,
      },
    };
    _send(message);
  };

  const requestMsg = () => {
    const seq = addSeq('requestMsg');
    //请求消息
    const message: SendMessage.RequestMsg = {
      type: 'requestMsg',
      seq,
      data: {
        userID,
        sessionID,
      },
    };
    _send(message);
  };

  const _ackMsg = (data: number[]) => {
    //确认收到消息
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

  return {
    webSocket: socketRef.current,
    sessionID,
    sendMsg,
    createSession,
    isConnected,
    messageList,
  };
};

export default useChat;
