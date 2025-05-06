import { AudioOutlined, EditOutlined, LeftOutlined, SendOutlined } from '@ant-design/icons';
import { ConfigProvider, Flex, Form, Input, Space, Image, message, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { concatMessageList, initSession, sendMessage, shutDownSession } from '../store/chat/chatSlice';
import { getSessionMessages } from '@/service/session';
import { Button } from 'antd';
import getAudio from '@/utils/getAudio';
import RateModal from '@/components/RateModal';
import MessageList from '@/components/MessageList';

export default function Chat() {
  const [form] = Form.useForm();
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { info } = useParams();
  const { uid } = useSelector((state: RootState) => state.user);
  const { isSessionClosed, sessionID, receiverID, userID } = useSelector((state: RootState) => state.chat);
  const [inputMode, setInputMode] = useState<string>('TEXT');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [showRateModal, setShowRateModal] = useState(false);

  useEffect(() => {
    if (isSessionClosed) {
      navigate('/');
    }
  }, [isSessionClosed]);

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
      dispatch(sendMessage({ content, contentType: 'TEXT' }));
      form.resetFields();
      setScroll((prev) => !prev);
    });
  };

  const sendAudio = () => {
    if (recordedBlob === null) {
      return;
    }
    // convert blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(recordedBlob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      dispatch(sendMessage({ content: base64data, contentType: 'VOICE' }));
      setIsRecording(false);
      setScroll((prev) => !prev);
      message.info('语音消息已发送！');
    };
    setRecordedBlob(null);
  };

  useEffect(sendAudio, [recordedBlob]);

  const handleConfirm = () => {
    Modal.confirm({
      title: '确认结束咨询吗？',
      content: '',
      onOk() {
        setShowRateModal(true);
      },
      onCancel() {},
    });
  };

  const handleRecordStart = () => {
    console.log('Recording started...');
    setIsRecording(true);
    chunksRef.current = [];
    if (!navigator.mediaDevices) {
      console.error('Your browser does not support media devices.');
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
          setRecordedBlob(blob);
        };
      })
      .catch((err) => {
        console.error('Error accessing microphone: ', err);
      });
  };

  const handleRecordStop = () => {
    console.log('Recording stopped.');
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
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
          <button
            onClick={() => {
              if (inputMode === 'TEXT') {
                setInputMode('AUDIO');
              } else {
                setInputMode('TEXT');
              }
            }}
            style={{ margin: 0, padding: 0, border: 'none', backgroundColor: 'transparent' }}
          >
            {inputMode === 'TEXT' ? <AudioOutlined style={{ fontSize: 22 }} /> : <EditOutlined style={{ fontSize: 22 }} />}
          </button>
          {inputMode === 'TEXT' ? (
            <Form className='flex w-full gap-2 items-center' form={form} wrapperCol={{ span: 24 }}>
              <div className='flex-1 items-center justify-center'>
                <Form.Item rules={[{ max: 100, message: '消息内容不能超过100字' }]} name='content' style={{ margin: 0 }} className='flex-1'>
                  <Input.TextArea autoSize={{ minRows: 1, maxRows: 4 }} autoFocus size='large' placeholder='输入消息' />
                </Form.Item>
              </div>
              <Button onClick={onClickSend} type='primary' shape='circle' icon={<SendOutlined style={{ color: '#fff' }} />} />
            </Form>
          ) : (
            <div className='w-full flex flex-row justify-center gap-4'>
              <Button type='primary' onClick={handleRecordStart} disabled={isRecording}>
                开始录音
              </Button>
              <Button type='primary' onClick={handleRecordStop} disabled={!isRecording}>
                停止录音
              </Button>
            </div>
          )}
        </ConfigProvider>
      </div>
      <RateModal
        visible={showRateModal}
        onCancel={() => {
          setShowRateModal(false);
        }}
        data={{
          counsellorID: receiverID,
          userID: userID,
          sessionID: sessionID,
        }}
      />
    </div>
  );
}
