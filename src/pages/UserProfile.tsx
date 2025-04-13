import { ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import HSTitle from '../components/HSTitle';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { editUserInfo, EditUserInfoParams } from '../service/users';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { nickname, email, uid, gender } = useSelector((state: RootState) => state.user);

  const onFinish = async ({ gender, password, nickname }: { gender: GenderType; password: string; nickname: string }) => {
    const body: EditUserInfoParams = {
      gender,
      nickname,
      uid: Number(uid),
    };
    if (password) body['password'] = password;
    try {
      await editUserInfo(body);
      message.success('更新信息成功');
      navigate('/home');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* 标题 */}
      <HSTitle title='编辑个人信息' canBack />
      <div className='w-[80%] max-w-[300px] m-auto mt-12'>
        <Form
          form={form}
          name='user-profile-edit'
          layout='horizontal'
          labelCol={{ span: 4 }}
          wrapperCol={{ offset: 1 }}
          onFinish={onFinish}
          initialValues={{ nickname, email, gender }}
        >
          <ProFormText
            fieldProps={{ variant: 'outlined', styles: { affixWrapper: { backgroundColor: '#ffffff80' } } }}
            name='nickname'
            label='昵称'
            placeholder='请输入昵称'
            rules={[{ required: true, message: '昵称不能为空' }]}
          />
          <ProFormText name='email' label='邮箱' readonly />
          <ProFormRadio.Group
            name='gender'
            label='性别'
            options={[
              { label: '男', value: 'male' },
              { label: '女', value: 'female' },
              { label: '保密', value: 'unknown' },
            ]}
          />
          <ProFormText.Password
            fieldProps={{ variant: 'outlined', styles: { affixWrapper: { backgroundColor: '#ffffff80' } } }}
            label='密码'
            name='password'
            rules={[
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/,
                message: '密码长度为 8 到 20 位，需要包含大写字母、小写字母、数字',
              },
            ]}
          />
          <div className='flex justify-center pt-6'>
            <Button size='large' type='primary' htmlType='submit'>
              提交更新
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
