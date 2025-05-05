import { ROLE_MAP } from '@/layouts/AdminLayout';
import { ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { Form, message, Modal } from 'antd';
import { useState } from 'react';

const AddAdminModal = ({ visible, onHide, role }: { visible: boolean; onHide: () => void; role: 'consultant' | 'supervisor' }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      open={visible}
      confirmLoading={loading}
      onOk={async () => {
        setLoading(true);
        form
          .validateFields()
          .then((res) => {
            console.log(res);
          })
          .then(() => {
            message.success(`成功添加${ROLE_MAP[role]} !`);
            onHide();
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      onCancel={onHide}
      title={role === 'consultant' ? '添加咨询师' : '添加督导'}
    >
      <Form form={form} className='mt-2'>
        <ProFormText
          name='nickname'
          label='姓名'
          rules={[
            {
              required: true,
              message: '请填写姓名',
            },
            {
              max: 8,
              message: '姓名不能超过8个字符',
            },
          ]}
        />
        <ProFormText
          name='email'
          label='邮箱'
          rules={[
            {
              required: true,
              message: '请填写邮箱',
            },
            {
              type: 'email',
              message: '邮箱格式错误！',
            },
          ]}
        />
        <ProFormRadio.Group
          name='gender'
          label='性别'
          options={[
            {
              label: '男',
              value: 'male',
            },
            {
              label: '女',
              value: 'female',
            },
            {
              label: '未知',
              value: 'unknown',
            },
          ]}
          rules={[
            {
              required: true,
              message: '请选择性别',
            },
          ]}
        />
      </Form>
    </Modal>
  );
};

export default AddAdminModal;
