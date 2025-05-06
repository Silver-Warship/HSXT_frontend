import request from '@/utils/request';
import { EditUserInfoParams } from '../users';

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

export const getAllSupervisor = (): Promise<{
  infos: UserInfo[];
}> => {
  return request.get(`/api/getAll?role=supervisor`);
};

export const getAllConsultant = (): Promise<{
  infos: UserInfo[];
}> => {
  return request.get(`/api/getAll?role=counsellor`);
};

export const editConsultantInfo = (data: EditUserInfoParams) => {
  return request.post('/api/user/editprofile', data);
};

// TODO

export const fuzzySearch = (
  nickname: string,
  role: 'supervisor' | 'counsellor' | 'user',
  id?: number,
): Promise<{
  code: number;
  codeMsg: string;
  infos: {
    nickname: string;
    email: string;
    id: number;
  }[];
}> => {
  return request.get(`/api/fuzzySearch?nickname=${nickname}&role=${role}${id ? `&id=${id}` : ''}`);
};
