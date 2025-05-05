import request from '@/utils/request';
import { Dayjs } from 'dayjs';

/** 获取指定某一个月内每天值班的督导和咨询师数量 */
export const getAllDuty = (
  day: Dayjs,
): Promise<{
  code: number;
  codeMsg: string;
  orderList: {
    startTimestamp: number;
    endTimestamp: number;
    counsellorNumber: number;
    supervisorNumber: number;
  }[];
}> => {
  const startTimestamp = day.startOf('month').valueOf(); // 秒级时间戳
  const endTimestamp = day.add(1, 'month').startOf('month').valueOf(); // 秒级时间戳
  return request.get(`/api/getAllOrderNumber?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&timeStep=86400000`);
};

/** 获取指定某一天值班的督导/咨询师列表 */
export const getDayDuty = (
  day: Dayjs,
  role: 'counsellor' | 'supervisor',
): Promise<{
  code: number;
  codeMsg: string;
  info: {
    id: number;
    nickname: string;
    email: string;
    gender: string;
    avater: null | string;
    role: string;
    arrangeID: number;
  }[];
}> => {
  const start = day.startOf('day').valueOf();
  const end = day.add(1, 'day').startOf('day').valueOf();
  return request.get(`/api/getArrangeOrderInTime?startTimestamp=${start}&endTimestamp=${end}&role=${role}`);
};

/** 删除指定排班的督导 */
export const deleteSupervisorDuty = (arrangementID: number) => {
  return request.post('/api/cancelSupervisorOrder', {
    arrangementID,
  });
};

/** 删除指定排班的咨询师 */
export const deleteConsultantDuty = (arrangementID: number) => {
  return request.post('/api/cancelCounsellorOrder', {
    arrangeIDs: [arrangementID],
  });
};

/** 添加某一天的督导排班 */
export const addSupervisorDuty = (day: Dayjs, id: number) => {
  return request.post('/api/addSupervisorOrder', {
    startTimestamp: day.startOf('day').valueOf(),
    endTimestamp: day.add(1, 'day').startOf('day').valueOf(),
    supervisorID: id,
  });
};

/** 添加某一天的咨询师排班 */
export const addConsultantDuty = (day: Dayjs, id: number) => {
  return request.post('/api/addCounsellorOrder', {
    counsellors: [
      {
        startTimestamp: day.startOf('day').valueOf(),
        endTimestamp: day.add(1, 'day').startOf('day').valueOf(),
        counsellorID: id,
      },
    ],
  });
};
