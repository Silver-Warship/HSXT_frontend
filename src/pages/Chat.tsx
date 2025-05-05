import { LeftOutlined, SendOutlined } from '@ant-design/icons';
import { ConfigProvider, Flex, Form, Input, Space, Image, message, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { initSession, sendMessage } from '../store/chat/chatSlice';
import { Button } from "antd";

export default function Chat() {
  const [form] = Form.useForm();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { info } = useParams();
  const { uid } = useSelector((state: RootState) => state.user);
  const [inputMode, setInputMode] = useState<string>('TEXT');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (info) {
      const arr = info.split('-').map((item) => Number(item));
      if (arr.length !== 3) {
        message.info('会话不存在！');
        navigate('/');
      }
      dispatch(
        initSession({
          sessionID: arr[2],
          receiverID: arr[0] === Number(uid) ? arr[1] : arr[0],
        }),
      );
    }
  }, [info]);

  const _scrollToBottom = () => {
    if (chatContainerRef.current) {
      // chatContainerRef.current.scrollTo(
      //   0,
      //   chatContainerRef.current.scrollHeight
      // );
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const { messageList } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    _scrollToBottom();
  }, [messageList]);

  const onClickSend = () => {
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

  const sendAudio = () => {
    // convert blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(recordedBlob!);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const message = {
        content: base64data,
        contentType: 'AUDIO',
      };
      dispatch(sendMessage(message));
      setRecordedBlob(null);
      setIsRecording(false);
      _scrollToBottom();
    }
  };

  const handleConfirm = () => {
    Modal.confirm({
      title: '确认结束咨询吗？',
      content: '',
      onOk() {
        console.log('用户选择了是，结束咨询');
      },
      onCancel() {
        console.log('用户选择了否，不结束咨询');
      },
    });
  };

  const handleRecordStart = () => {
      console.log("Recording started...");
      setIsRecording(true);
      chunksRef.current = [];
      if (!navigator.mediaDevices) {
          console.error("Your browser does not support media devices.");
          return;
      }
      navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.start();
  
          mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
              chunksRef.current.push(event.data);
          }
          };
  
          mediaRecorder.onstop = () => {
              const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
              setRecordedBlob(blob);
          };
      })
      .catch(err => {
          console.error("Error accessing microphone: ", err);
      });
  };
  
  const handleRecordStop = () => {  
    console.log("Recording stopped.");
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    sendAudio();
  };

  return (
    <div>
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
      <div ref={chatContainerRef} style={{ height: 'calc(100vh - 128px)' }} className='w-full bg-theme-gray overflow-y-auto'>
        <Flex vertical>
          {messageList.map(({ messageID: id, role, content }, index) =>
            role ? (
              <div key={index} className='w-full p-3 pl-[72px]'>
                <Flex gap='small' justify='flex-end' align='flex-start'>
                  <div className='bg-chat-bg p-3 rounded-md break-words text-wrap max-w-[400px]'>
                    <p className='leading-6'>{content}</p>
                  </div>
                  <Image preview={false} className='rounded-full flex-shrink-0' src='/avatar.svg' alt='avatar' width={44} height={44} />
                </Flex>
              </div>
            ) : (
              <div key={id} className='w-full p-3 pr-[72px]'>
                <Flex gap='small' align='flex-start'>
                  <Image preview={false} className='rounded-full flex-shrink-0' src='/avatar.svg' alt='avatar' width={44} height={44} />
                  <div className='bg-white p-3 rounded-md break-words text-wrap max-w-[400px]'>
                    <p className='leading-6'>{content}</p>
                  </div>
                </Flex>
              </div>
            ),
          )}
        </Flex>
      </div>
      {/* input */}
      <div className='absolute bottom-0 left-0 right-0 w-full bg-[#F9F9F9] border-t border-black-fifth flex items-center gap-2 px-3 py-2'>
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
          <button onClick={() => {
            if (inputMode === 'TEXT') {
              setInputMode('AUDIO');
            } 
            else {
              setInputMode('TEXT');
            }
          }} style={{ margin: 0, padding: 0, border: 'none', backgroundColor: 'transparent' }}>
            {inputMode === 'TEXT' ? (
              <Image preview={false} src='/voice.svg' alt='text' width={24} height={24} />
            ) : (
              <Image preview={false} src='/edit.svg' alt='audio' width={24} height={24} />
            )}

          </button> 
          {
            inputMode === 'TEXT'? (
              <Form className='flex w-full gap-2 items-center' form={form} wrapperCol={{ span: 24 }}>
                <div className='flex-1 items-center justify-center'>
                  <Form.Item rules={[{ max: 100, message: '消息内容不能超过100字' }]} name='content' style={{ margin: 0 }} className='flex-1'>
                    <Input.TextArea autoSize={{ minRows: 1, maxRows: 4 }} autoFocus size='large' placeholder='输入消息' />
                  </Form.Item>
                </div>
                <button onClick={onClickSend} className='flex-shrink-0 w-10 h-10 bg-theme-green rounded-full flex items-center justify-center'>
                  <SendOutlined style={{ color: '#fff' }} />
                </button>
              </Form>
            ) : (
              <div> 
                <Button type="primary" onClick={handleRecordStart} disabled={isRecording}>
                  开始录音
                </Button>
                <Button type="primary" onClick={handleRecordStop} disabled={!isRecording}>
                  停止录音
                </Button>
              </div>
            )
          }
        </ConfigProvider>
      </div>
    </div>
  );
}
