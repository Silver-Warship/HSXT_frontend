type MessageTypes = 'sendMsg' | 'requestMsg' | 'ackMsg' | 'registerConnection' | 'createSession' | 'closeSession';
type ContentTypes = 'TEXT' | 'IMAGE' | 'VOICE' | 'FILE' | 'BIGFILE';
type MessageStatus = 'success' | 'fail' | 'pending';

// 数据库的消息格式
type RawMessage = {
  content: string;
  contentType: ContentTypes;
  messageID: number;
  timestamp: number;
};

// UI层的消息格式
type UserMessage = {
  role: number;
  seq?: string;
  content: string;
  contentType: ContentTypes;
  messageID?: number;
  timestamp: number;
  status: MessageStatus;
};

// 接收的消息类型
namespace ReceiveMessage {
  type Wrapper = {
    seq: string;
    code: number;
    codeMsg: string;
  };

  type SendMsgData = {
    messageID: number;
  };
  type RequestMsgData = {
    messages: RawMessage[];
  };
  type AckMsgData = null | string;
  type RegisterConnectionData = null | string;
  type createSessionData = {
    sessionID: number;
  };
  type CloseSessionData = null | { sessionID: number };

  type SendMsgResponse = Wrapper & { data: SendMsgData };
  type RequestMsgResponse = Wrapper & { data: RequestMsgData };
  type AckMsgResponse = Wrapper & { data: AckMsgData };
  type RegisterConnectionResponse = Wrapper & { data: RegisterConnectionData };
  type createSessionResponse = Wrapper & { data: createSessionData };
  type CloseSessionResponse = Wrapper & { data: CloseSessionData };

  type Response = SendMsgResponse | RequestMsgResponse | AckMsgResponse | RegisterConnectionResponse | createSessionResponse | CloseSessionResponse;
}

// 发送的消息类型
namespace SendMessage {
  type Wrapper = {
    type: MessageTypes;
    seq: string;
  };

  type SendMsgData = {
    sessionID: number;
    senderID: number;
    receiverID: number;
    content: string;
    contentType: ContentTypes;
    timestamp: number;
  };
  type RequestMsgData = {
    userID: number;
    sessionID: number;
  };
  type AckMsgData = {
    messageIDs: number[];
    ackTimestamp: number;
  };
  type RegisterConnectionData = {
    userID: number;
  };
  type createSessionData = {
    firstUserID: number;
    secondUserID: number;
    sessionStartTime: number;
  };
  type CloseSessionData = {
    sessionID: number;
  };

  type SendMsg = Wrapper & { data: SendMsgData };
  type RequestMsg = Wrapper & { data: RequestMsgData };
  type AckMsg = Wrapper & { data: AckMsgData };
  type RegisterConnection = Wrapper & { data: RegisterConnectionData };
  type createSession = Wrapper & { data: createSessionData };
  type CloseSession = Wrapper & { data: CloseSessionData };

  type Message = SendMsg | RequestMsg | AckMsg | RegisterConnection | createSession | CloseSession;
}
