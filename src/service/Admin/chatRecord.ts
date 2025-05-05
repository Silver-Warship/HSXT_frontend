import request from '@/utils/request';
import { Dayjs } from 'dayjs';

/** 添加某一天的咨询师排班 */
export const getConsultRecord = ({
  counsellorID,
  startTime,
  endTime,
  userID,
}: {
  counsellorID: number;
  startTime?: Dayjs;
  endTime?: Dayjs;
  userID?: number;
}): Promise<{
  code: number;
  codeMsg: string;
  helpRecords: {
    userName: string;
    userID: number;
    consultantName: string;
    consultantID: number;
    timestamp: number;
    duration: number;
    userRating: number;
    appraisal: string;
  }[];
}> => {
  const startTimestamp = startTime?.valueOf();
  const endTimestamp = endTime?.valueOf();
  return request.get(
    `/api/getConsultantRecord?counsellorID=${counsellorID}${userID ? `&userID=${userID}` : ''}${
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
