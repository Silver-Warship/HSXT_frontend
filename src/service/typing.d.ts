declare namespace Session {
  type Wrapper = {
    code: number;
    codeMsg: string;
  };

  type GetSessionMessagesContent = {
    sendID: number;
    receiveID: number;
    content: string;
    contentType: ContentTypes;
    timestamp: number;
  };

  type GetSessionMessagesResponse = Wrapper & {
    messages: GetSessionMessagesContent[];
  };
}
