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
  }[];
}> => {
  return request.post(`/api/getRunningSession?userID=${userID}`);
};
