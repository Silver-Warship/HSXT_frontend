import request from '@/utils/request';
import dayjs from 'dayjs';

export type AdminLoginParams = {
  email: string;
  password?: string;
  verifyCode?: string;
};

export const adminLogin = ({
  email,
  password,
  verifyCode,
}: AdminLoginParams): Promise<{
  code: number;
  codeMsg: string;
  token: string;
}> => {
  return request.post('/api/admin/login', {
    email,
    password,
    verificationCode: verifyCode,
  });
};

export const consultantLogin = ({
  email,
  password,
  verifyCode,
}: AdminLoginParams): Promise<{
  code: number;
  codeMsg: string;
  token: string;
}> => {
  return request.post('/api/counsellor/login', {
    email,
    password,
    verificationCode: verifyCode,
  });
};

export const supervisorLogin = ({
  email,
  password,
  verifyCode,
}: AdminLoginParams): Promise<{
  code: number;
  codeMsg: string;
  token: string;
}> => {
  return request.post('/api/supervisor/login', {
    email,
    password,
    verificationCode: verifyCode,
  });
};

export type UserInfo = {
  nickname: string;
  email: string;
  id: number;
};

export type CounsullerInfo = {
  nickname: string;
  email: string;
  counsellorID: number;
  gender: string;
  selfAppraisal: string;
};

export const getAllSupervisor = (): Promise<{
  infos: UserInfo[];
}> => {
  return request.get(`/api/getAll?role=supervisor`);
};

export const getAllConsultant = (): Promise<{
  infos: CounsullerInfo[];
}> => {
  return request.get(`/api/getOnDutyCounsellor?timestamp=${dayjs().valueOf()}`);
};
