import React, { useState } from 'react';
import { Steps, Form, Input, Button, Radio, InputNumber, Select, Checkbox } from 'antd';

const { Step } = Steps;

interface FormValues {
  name: string;
  phone: string;
  email: string;
  courseType: string;
  participantCount: number;
  timezone?: string;
  deviceCheck?: string[];
  city?: string;
  groupDiscountCode?: string;
}

const StepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm<FormValues>();

  const steps = [
    {
      title: '步骤 1',
      content: (
        <Form form={form} name='step1'>
          <Form.Item
            label='姓名'
            name='name'
            rules={[
              { required: true, message: '请输入姓名' },
              {
                pattern: /^[\u4e00-\u9fa5]{2,20}$/,
                message: '姓名必须为 2 - 20 个中文字符',
              },
            ]}
          >
            <Input placeholder='请输入姓名' />
          </Form.Item>
          <Form.Item
            label='手机号'
            name='phone'
            rules={[
              { required: true, message: '请输入手机号' },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入 11 位大陆手机号',
              },
            ]}
          >
            <Input type='number' placeholder='请输入手机号' />
          </Form.Item>
          <Form.Item
            label='邮箱'
            name='email'
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱' },
            ]}
          >
            <Input placeholder='请输入邮箱' />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: '步骤 2',
      content: (
        <Form form={form} name='step2'>
          <Form.Item label='课程类型' name='courseType' rules={[{ required: true, message: '请选择课程类型' }]}>
            <Radio.Group>
              <Radio value='直播课'>直播课</Radio>
              <Radio value='录播课'>录播课</Radio>
              <Radio value='线下课'>线下课</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label='报名人数' name='participantCount' initialValue={1} rules={[{ required: true, message: '请选择报名人数' }]}>
            <InputNumber min={1} max={10} />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: '步骤 3',
      content: (
        <Form form={form} name='step3'>
          <p>hello</p>
          {form.getFieldValue('courseType') === '直播课' && (
            <>
              <Form.Item label='时区选择' name='timezone' initialValue='系统时区'>
                <Select
                  options={[
                    { label: '系统时区', value: '系统时区' },
                    // 可以添加更多时区选项
                    { label: 'UTC', value: 'UTC' },
                    { label: 'GMT+8', value: 'GMT+8' },
                    { label: 'GMT-5', value: 'GMT-5' },
                  ]}
                />
              </Form.Item>
              <Form.Item label='设备检测' name='deviceCheck'>
                <Checkbox.Group>
                  <Checkbox value='摄像头'>摄像头</Checkbox>
                  <Checkbox value='麦克风'>麦克风</Checkbox>
                  <Checkbox value='扬声器'>扬声器</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </>
          )}
          {form.getFieldValue('courseType') === '线下课' && (
            <Form.Item label='所在城市' name='city'>
              <Select
                showSearch
                placeholder='请选择城市'
                optionFilterProp='children'
                filterOption={(input, option) => {
                  if (!option) return false; // 检查option是否为undefined
                  return option.label.toLowerCase().includes(input.toLowerCase());
                }}
                options={[
                  { value: '北京', label: '北京' },
                  { value: '上海', label: '上海' },
                  { value: '广州', label: '广州' },
                  // 可以添加更多城市选项
                ]}
              />
            </Form.Item>
          )}
          {form.getFieldValue('participantCount') && form.getFieldValue('participantCount') > 1 && (
            <Form.Item
              label='团体优惠码'
              name='groupDiscountCode'
              rules={[
                {
                  pattern: /^EDU-\d{6}$/,
                  message: '团体优惠码格式应为 EDU-后接 6 位数字',
                },
              ]}
            >
              <Input placeholder='请输入团体优惠码' />
            </Form.Item>
          )}
        </Form>
      ),
    },
  ];

  const nextStep = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch(() => {});
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = () => {
    form
      .validateFields()
      .then((values: FormValues) => {
        console.log('表单数据:', values);
      })
      .catch(() => {});
  };

  return (
    <div className='mx-2 p-4'>
      <Steps current={currentStep}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className='mt-5'>{steps[currentStep].content}</div>
      <div className='mt-5'>
        {currentStep > 0 && (
          <Button onClick={prevStep} style={{ marginRight: 8 }}>
            上一步
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button type='primary' onClick={nextStep}>
            下一步
          </Button>
        ) : (
          <Button type='primary' onClick={onFinish}>
            提交
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepForm;
