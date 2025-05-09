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

export const addConsultantRecord = (data: {
  counsellorID: number;
  userID: number;
  sessionID: number;
  userRating: number;
  appraisal: string;
  counsellorAppraisal: string;
}) => {
  return request.post('/api/addConsultantRecord', data);
};
