import request from "@/utils/request";

export const addCounsellor = (
    name: string, email: string, gender: string
): Promise<{
  code: number;
  codeMsg: string;
  content: string;
}> => {
  return request.post(`/api/addCounsellor`, {
    name,
    email,
    gender,
  });
};

export const addSupervisor = (
  name: string, email: string, gender: string
): Promise<{
  code: number;
  codeMsg: string;
  content: string;
}> => {
  return request.post(`/api/addSupervisor`, {
    name: name,
    email: email,
    gender: gender
  });
};


export const addAdmin = (
  name: string, email: string, gender: string
): Promise<{
  code: number;
  codeMsg: string;
  content: string;
}> => {
  return request.post(`/api/addAdmin`, {
    name,
    email,
    gender,
  });
};

export const deleteRole = (
  uid: number, role: string
): Promise<{
  code: number;
  codeMsg: string;
  content: string;
}> => {
  return request.post(`/api/delete`, {
    role: role,
    uid: uid
  });
};