import { Form, message, Tabs } from 'antd';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { login, LoginParams } from '../service/users';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';

type LoginType = 'password' | 'verifyCode';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<LoginType>('verifyCode');
  const [form] = Form.useForm();

  const onFinish = async (values: {
    username: string; // 密码登录时的邮箱
    password: string; // 密码
    email: string; // 验证码登录时的邮箱
    verifyCode: string; // 验证码
  }) => {
    const { username, password, email, verifyCode } = values;

    let params: LoginParams = { email: '' };
    if (loginType === 'password') {
      params = {
        email: username,
        password,
      };
    } else if (loginType === 'verifyCode') {
      params = {
        email,
        verifyCode,
      };
    }

    try {
      const res = await login(params);
      const { code, codeMsg, token } = res;
      if (code === 600) {
        // 正常情况，直接存储token并重定向到home页面
        localStorage.setItem('token', token);
        message.success('登录成功！');
        setTimeout(() => {
          navigate('/home');
        }, 0);
      } else {
        message.error(`登录失败！${codeMsg}`);
        form.setFieldsValue({
          username: '',
          email: '',
          password: '',
          verifyCode: '',
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className='mx-auto pt-[5vh]'>
        <LoginForm
          logo='https://github.githubassets.com/favicons/favicon.png'
          title='花狮心途'
          subTitle='专注于大学生群体的心理健康服务平台'
          onFinish={onFinish}
          form={form}
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
            items={[
              {
                key: 'password',
                label: '密码登录',
                icon: <UserOutlined />,
              },
              {
                key: 'verifyCode',
                label: '验证码登录',
                icon: <MobileOutlined />,
              },
            ]}
          />
          {loginType === 'password' && (
            <>
              <ProFormText
                name='username'
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'邮箱'}
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱!',
                  },
                  {
                    pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: '邮箱格式错误！',
                  },
                ]}
              />
              <ProFormText.Password
                name='password'
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                  {
                    max: 16,
                    message: '密码长度不能超过16位！',
                  },
                  // {
                  //   pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/,
                  //   message: '密码至少包含大小写字母和数字，长度至少8位！',
                  // },
                ]}
              />
            </>
          )}
          {loginType === 'verifyCode' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={'prefixIcon'} />,
                }}
                name='email'
                placeholder={'邮箱'}
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱！',
                  },
                  {
                    pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: '邮箱格式错误！',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'验证码'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'获取验证码'}`;
                  }
                  return '获取验证码';
                }}
                name='verifyCode'
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
                onGetCaptcha={async () => {
                  const { email } = form.getFieldsValue();
                  console.log(email);
                  const res = await login({ email });
                  console.log(res);
                  const { code, codeMsg } = res;
                  if (code === 600) {
                    message.success('验证码发送成功！');
                  } else {
                    message.error(`发送失败！${codeMsg}`);
                    form.setFieldsValue({
                      verifyCode: '',
                    });
                  }
                }}
              />
            </>
          )}
          {loginType === 'password' && (
            <div className='text-end mb-4'>
              <a
                onClick={() => {
                  setLoginType('verifyCode');
                }}
              >
                忘记密码
              </a>
            </div>
          )}
        </LoginForm>
      </div>
    </div>
  );
}
