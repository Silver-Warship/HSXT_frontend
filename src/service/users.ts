import request from '../utils/request';

export type LoginParams = {
  email: string;
  password?: string;
  verifyCode?: string;
};

export const login = ({
  email,
  password,
  verifyCode,
}: LoginParams): Promise<{
  code: number;
  codeMsg: string;
  token: string;
}> => {
  return request.post('/api/users/login', {
    email,
    password,
    verificationCode: verifyCode,
  });
};

/** 根据header中的token获取用户信息 */
export const getUserInfo = (): Promise<{
  uid: string;
  nickname: string;
  email: string;
  gender: 'male' | 'female' | 'unknown';
}> => {
  return request.get('/api/tokenVerify');
};

export type EditUserInfoParams = { uid?: number; gender: GenderType; password?: string; nickname: string };

export const editUserInfo = (data: EditUserInfoParams) => {
  return request.post('/api/user/editprofile', data);
};
