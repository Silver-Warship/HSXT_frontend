import { PictureTwoTone, SendOutlined } from '@ant-design/icons';
import { Flex, Form, Input, message, Image, Button } from 'antd';
import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { concatMessageList, initSession, sendMessage } from '../../store/chat/chatSlice';
import { RootState } from '../../store/store';
import { getSessionMessages } from '@/service/session';

const AdminChat = () => {
  const [form] = Form.useForm();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { info } = useParams();
  const { uid } = useSelector((state: RootState) => state.user);
  const { isSessionClosed } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (info) {
      const arr = info.split('-').map((item) => Number(item));
      if (arr.length !== 3) {
        message.info('会话不存在！');
        navigate('/');
        return;
      }
      dispatch(
        initSession({
          sessionID: arr[2],
          receiverID: arr[0] === Number(uid) ? arr[1] : arr[0],
        }),
      );
      getSessionMessages(arr[2]).then((res) => {
        dispatch(
          concatMessageList(
            res.messages.map((message) => {
              const role = message.sendID === Number(uid) ? 1 : 0;
              return {
                ...message,
                role,
                status: 'success',
              };
            }),
          ),
        );
      });
    }
  }, [info]);

  const _scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const { messageList } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    _scrollToBottom();
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
      dispatch(sendMessage({ content, contentType: 'TEXT' }));
      form.resetFields();
      _scrollToBottom();
    });
  };

  return (
    <div className='h-full relative'>
      {/* chat */}
      <div ref={chatContainerRef} className='overflow-y-auto'>
        <Flex vertical>
          {messageList.map(({ messageID: id, role, content }, index) =>
            role ? (
              <div key={index} className='w-full p-3 pl-[72px]'>
                <Flex gap='small' justify='flex-end' align='flex-start'>
                  <div className='bg-blue-500 text-white p-3 rounded-md break-words text-wrap max-w-[400px]'>
                    <p className='leading-6'>{content}</p>
                  </div>
                  <Image preview={false} className='rounded-full flex-shrink-0' src='/avatar.svg' alt='avatar' width={44} height={44} />
                </Flex>
              </div>
            ) : (
              <div key={id} className='w-full p-3 pr-[72px]'>
                <Flex gap='small' align='flex-start'>
                  <Image preview={false} className='rounded-full flex-shrink-0' src='/avatar.svg' alt='avatar' width={44} height={44} />
                  <div className='bg-gray-100 p-3 rounded-md break-words text-wrap max-w-[400px]'>
                    <p className='leading-6'>{content}</p>
                  </div>
                </Flex>
              </div>
            ),
          )}
        </Flex>
      </div>
      {/* input */}
      <div className='absolute bottom-0 left-0 right-0 w-full flex items-center gap-2 px-3 py-2'>
        <PictureTwoTone className='text-[24px]' />
        <Form className='flex w-full gap-2 items-center' form={form} wrapperCol={{ span: 24 }}>
          <div className='flex-1 items-center justify-center'>
            <Form.Item rules={[{ max: 100, message: '消息内容不能超过100字' }]} name='content' style={{ margin: 0 }} className='flex-1'>
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 4 }} autoFocus size='large' placeholder='输入消息' />
            </Form.Item>
          </div>
          <Button type='primary' onClick={onClickSend} icon={<SendOutlined />}></Button>
        </Form>
      </div>
    </div>
  );
};

export default AdminChat;
