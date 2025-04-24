import { message } from 'antd';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// 创建 Axios 实例
const instance: AxiosInstance = axios.create({
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在这里添加用户 token
    const token = localStorage.getItem('token'); // 假设 token 存储在 localStorage 中
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    console.error('请求错误:', error);
    return Promise.reject(error);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 提取数据
    const { data } = response;
    return data;
  },
  (error) => {
    // 处理响应错误
    console.error('响应错误:', error);
    if (error.response) {
      // 服务器返回了错误状态码
      const { status } = error.response;
      switch (status) {
        case 401:
          // 处理未授权错误，例如跳转到登录页面
          console.log('未授权，请重新登录');
          message.error('未授权，请重新登录');
          localStorage.removeItem('token');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          break;
        case 404:
          console.log('请求的资源不存在');
          break;
        case 500:
          console.log('服务器内部错误');
          break;
        default:
          console.log(`请求失败，状态码: ${status}`);
      }
    } else if (error.request) {
      // 请求已发送，但没有收到响应
      console.log('没有收到服务器响应');
    } else {
      // 在设置请求时发生错误
      console.log('请求设置出错:', error.message);
    }
    return Promise.reject(error);
  },
);

// 封装请求函数，使用泛型指定返回类型

// 封装 get 请求方法
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const get = <T>(url: string, config?: any) => {
  return instance.get(url, config) as Promise<T>;
};

// 封装 post 请求方法（可按需添加其他方法）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const post = <T>(url: string, data?: any, config?: any) => {
  return instance.post(url, data, config) as Promise<T>;
};

export default { get, post };
