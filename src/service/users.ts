import request from '../utils/request';

export type LoginParamsType = {
  email: string;
  password?: string;
  verifyCode?: string;
};

export const login = ({
  email,
  password,
  verifyCode,
}: LoginParamsType): Promise<{
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

export const getUserInfo = (): Promise<{
  code: number;
  codeMsg: string;
  data: {
    uid: string;
    nickname: string;
    email: string;
  };
}> => {
  return request.get('/api/tokenVerify');
};
