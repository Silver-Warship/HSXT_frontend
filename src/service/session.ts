import request from '../utils/request';

export const getRunningSession = ({
  userID,
}: {
  userID: number;
}): Promise<{
  code: number;
  codeMsg: string;
  sessions: {
    sessionID: number;
    firstUserID: number;
    secondUserID: number;
    other: {
      avatar: string;
      nickname: string;
    };
  }[];
}> => {
  return request.post(`/api/getRunningSession?userID=${userID}`);
};

export const getSessionMessages = (sessionID: number): Promise<Session.GetSessionMessagesResponse> => {
  return request.get(`/api/getSessionMessages?sessionID=${sessionID}`);
};
