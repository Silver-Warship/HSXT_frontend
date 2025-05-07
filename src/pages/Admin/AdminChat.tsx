import { AudioOutlined, EditOutlined, PictureTwoTone, SendOutlined } from '@ant-design/icons';
import { Flex, Form, Input, message, Image, Button } from 'antd';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { concatMessageList, createSession, initSession, sendMessage } from '../../store/chat/chatSlice';
import { RootState } from '../../store/store';
import { getSessionMessages } from '@/service/session';
import MessageList from '@/components/MessageList';
import dayjs from 'dayjs';
import { getDayDuty } from '@/service/Admin/schedule';

const AdminChat = () => {
  const [form] = Form.useForm();
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { info } = useParams();
  const { uid } = useSelector((state: RootState) => state.user);
  const { isSessionClosed, sessionID } = useSelector((state: RootState) => state.chat);
  const currentSessionID = useMemo(() => sessionID, []);
  const [supervisorID, setSupervisorID] = useState<number | null>(null);
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

  useEffect(() => {
    if (isSessionClosed) {
      navigate('/admin');
    }
  }, [isSessionClosed]);

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

  useEffect(() => {
    if (sessionID && supervisorID && sessionID !== currentSessionID) {
      // 替换当前页面
      navigate(`/admin/session/${uid}-${supervisorID}-${sessionID}`);
    }
  }, [sessionID]);

  const getSupervisorHelp = async () => {
    try {
      const res = await getDayDuty(dayjs(), 'supervisor');
      if (res.info.length) {
        const id = res.info[0].id;
        setSupervisorID(id);
        dispatch(createSession({ receiverID: id }));
      } else {
        message.info('没有空闲的督导！');
      }
      console.log(res);
    } catch (e) {
      console.log(e);
    }
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
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (recordedBlob) {
      sendAudio();
    }
  };

  return (
    <div className='h-full relative flex flex-col'>
      <div className='absolute top-[-40px] right-2 flex gap-2 items-center'>
        <Button onClick={getSupervisorHelp} color='primary' variant='outlined'>
          求助督导
        </Button>
        <Button
          onClick={() => {
            dispatch(sendMessage({ content: '/close', contentType: 'TEXT' }));
          }}
          type='primary'
          danger
        >
          结束咨询
        </Button>
      </div>
      {/* chat */}
      <MessageList scroll={scroll} messageList={messageList} onCloseSession={() => {}} isAdmin={true} />
      {/* input */}
      <div className='w-full flex items-center gap-2 px-3 py-2'>
        {/* <PictureTwoTone className='text-[24px]' /> */}
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
            <Button type='primary' onClick={onClickSend} icon={<SendOutlined />}></Button>
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
      </div>
    </div>
  );
};

export default AdminChat;
