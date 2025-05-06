import request from '@/utils/request';
import { Dayjs } from 'dayjs';

/** 获取咨询记录 */
export const getConsultRecord = ({
  counsellorID,
  startTime,
  endTime,
  userID,
}: {
  counsellorID?: number;
  startTime?: Dayjs;
  endTime?: Dayjs;
  userID?: number;
}): Promise<{
  code: number;
  codeMsg: string;
  consultantRecords: {
    recordID: number;
    userID: number;
    userName: string;
    counsellorID: number;
    counsellorName: string;
    timestamp: number;
    sessionID: number;
    duration: number;
    userRating: number;
    appraisal: string;
    counsellorAppraisal: string;
  }[];
}> => {
  const startTimestamp = startTime?.valueOf();
  const endTimestamp = endTime?.valueOf();
  return request.get(
    `/api/getConsultantRecord?${counsellorID ? `counsellorID=${counsellorID}` : ''}${userID ? `&userID=${userID}` : ''}${
      startTimestamp ? `&startTimestamp=${startTimestamp}` : ''
    }${endTimestamp ? `&endTimestamp=${endTimestamp}` : ''}`,
  );
};

export const getHelpRecord = ({
  counsellorID,
  startTime,
  endTime,
  supervisorID,
}: {
  counsellorID: number;
  startTime?: Dayjs;
  endTime?: Dayjs;
  supervisorID?: number;
}): Promise<{
  code: number;
  codeMsg: string;
  helpRecords: {
    counsellorID: number;
    counsellorName: string;
    recordID: number;
    supervisorID: number;
    supervisorName: string;
    userSessionID: number;
    helpSessionID: number;
  }[];
}> => {
  const startTimestamp = startTime?.valueOf();
  const endTimestamp = endTime?.valueOf();
  return request.get(
    `/api/getHelpRecord?counsellorID=${counsellorID}${supervisorID ? `&supervisorID=${supervisorID}` : ''}${
      startTimestamp ? `&startTimestamp=${startTimestamp}` : ''
    }${endTimestamp ? `&endTimestamp=${endTimestamp}` : ''}`,
  );
};

export const exportConsultantRecord = (
  recordID: number,
): Promise<{
  code: number;
  codeMsg: string;
  content: string;
}> => {
  return request.get(`/api/exportConsultantRecord?recordID=${recordID}`);
};
