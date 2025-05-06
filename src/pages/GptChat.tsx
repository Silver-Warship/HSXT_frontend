import { AudioOutlined, EditOutlined, LeftOutlined, SendOutlined } from '@ant-design/icons';
import { ConfigProvider, Flex, Form, Input, Space, Image, message, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { concatMessageList, initSession, sendMessage, sendMessageToGPT, shutDownSession } from '../store/chat/chatSlice';
import { Button } from 'antd';
import MessageList from '@/components/MessageList';

export default function GptChat() {
  const [form] = Form.useForm();
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSessionClosed } = useSelector((state: RootState) => state.chat);

  const { messageList } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    setScroll((prev) => !prev);
  }, [messageList]);

  const onClickSend = () => {
    if (isSessionClosed) {
      message.info('该会话已关闭！');
      return;
    }
    form.validateFields().then((values) => {
      const { content } = values;
      if (!content) {
        message.info('消息内容不能为空！');
        return;
      }
      dispatch(sendMessageToGPT({ content }));
      form.resetFields();
      
      setScroll((prev) => !prev);
    });
  };

  const handleConfirm = () => {
    Modal.confirm({
      title: '确认结束咨询吗？',
      content: '',
      onOk() {
        navigate('/');
      },
      onCancel() {},
    });
  };

  return (
    <div className='h-full flex flex-col'>
      {/* 头部 */}
      <div className='bg-white w-full h-16 px-5 flex items-center justify-between'>
        <Space size={'middle'}>
          <LeftOutlined onClick={() => navigate(-1)} />
          <div className='flex flex-col'>
            <p className='text-lg'>咨询师{}</p>
            <p className='text-black-second text-sm'>extra info here</p>
          </div>
        </Space>
        <Image onClick={handleConfirm} preview={false} src='/exit.svg' alt='exit' width={28} height={28} />
      </div>
      {/* chat */}
      <MessageList messageList={messageList} scroll={scroll} onCloseSession={handleConfirm} />
      {/* input */}
      <div className='w-full bg-[#F9F9F9] border-t border-black-fifth flex items-center gap-2 px-3 py-2'>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#C3E006',
            },
            components: {
              Input: {
                activeBorderColor: '#E1FB7A',
                hoverBorderColor: '#A1C903',
              },
              Button: {},
            },
          }}
        >
          <button style={{ margin: 0, padding: 0, border: 'none', backgroundColor: 'transparent' }}>
            <EditOutlined style={{ fontSize: 22 }} />
          </button>
            <Form className='flex w-full gap-2 items-center' form={form} wrapperCol={{ span: 24 }}>
              <div className='flex-1 items-center justify-center'>
                <Form.Item rules={[{ max: 100, message: '消息内容不能超过100字' }]} name='content' style={{ margin: 0 }} className='flex-1'>
                  <Input.TextArea autoSize={{ minRows: 1, maxRows: 4 }} autoFocus size='large' placeholder='输入消息' />
                </Form.Item>
              </div>
              <Button onClick={onClickSend} type='primary' shape='circle' icon={<SendOutlined style={{ color: '#fff' }} />} />
            </Form>
        </ConfigProvider>
      </div>
    </div>
  );
}
