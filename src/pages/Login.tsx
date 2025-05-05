import { Form, message, Tabs } from 'antd';
import { LoginForm, ProFormCaptcha, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { login, LoginParams } from '../service/users';
import { LockOutlined, MailOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { use, useState } from 'react';
import { adminLogin, consultantLogin, supervisorLogin } from '@/service/Admin/user';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '@/store/user/userSlice';

type LoginType = 'password' | 'verifyCode';

function setItemAsync(key: string, value: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      localStorage.setItem(key, value);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export default function LoginPage({ isAdmin = false }: { isAdmin?: boolean }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginType, setLoginType] = useState<LoginType>('verifyCode');
  const [form] = Form.useForm();

  const onFinish = async (values: {
    usertype?: 'consultant' | 'supervisor' | 'admin';
    username: string; // 密码登录时的邮箱
    password: string; // 密码
    email: string; // 验证码登录时的邮箱
    verifyCode: string; // 验证码
  }) => {
    const { username, password, email, verifyCode, usertype = 'visitor' } = values;

    let params: LoginParams = { email: '' };
    if (loginType === 'password') {
      params = {
        email: username,
        password,
      };
    } else if (loginType === 'verifyCode') {
      params = {
        email: username,
        verifyCode,
      };
    }

    try {
      // const res = await login(params);
      let res;
      if (!isAdmin) res = await login(params);
      else {
        switch (usertype) {
          case 'admin':
            res = await adminLogin(params);
            break;
          case 'consultant':
            res = await consultantLogin(params);
            break;
          case 'supervisor':
            res = await supervisorLogin(params);
            break;
          default:
            console.error('出错啦！');
            return;
        }
      }
      const { code, codeMsg, token } = res!;
      if (code === 600) {
        // 正常情况，直接存储token并重定向到home页面
        // localStorage.setItem('token', token);
        // message.success('登录成功！');
        // navigate('/home');
        setItemAsync('token', token).then(() => {
          message.success('登录成功！');
          navigate('/');
          dispatch(setUserInfo({ usertype }));
        });
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
          {isAdmin && (
            <ProFormSelect
              name='usertype'
              options={[
                {
                  label: '咨询师',
                  value: 'consultant',
                },
                {
                  label: '督导',
                  value: 'supervisor',
                },
                {
                  label: '管理员',
                  value: 'admin',
                },
              ]}
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder='选择身份'
              rules={[
                {
                  required: true,
                  message: '请选择身份!',
                },
              ]}
            />
          )}
          <ProFormText
            name='username'
            fieldProps={{
              size: 'large',
              prefix: <MailOutlined />,
            }}
            placeholder='邮箱'
            rules={[
              {
                required: true,
                message: '请输入邮箱!',
              },
              {
                type: 'email',
                message: '邮箱格式错误！',
              },
            ]}
          />
          {loginType === 'password' && (
            <>
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
                ]}
              />
            </>
          )}
          {loginType === 'verifyCode' && (
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
                const { username: email } = form.getFieldsValue();
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
