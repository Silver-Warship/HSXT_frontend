import request from '@/utils/request';
import dayjs from 'dayjs';

export const getAllDuty = (
  year: number,
  month: number,
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
  const startTimestamp = dayjs(`${year}-${month}-01`).startOf('month').valueOf(); // 秒级时间戳
  const endTimestamp = dayjs(`${year}-${month + 1}-01`)
    .startOf('month')
    .valueOf(); // 秒级时间戳
  return request.get(`/api/getAllOrderNumber?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&timeStep=86400000`);
};
