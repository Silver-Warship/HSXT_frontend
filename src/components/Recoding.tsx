import { useState, useRef } from 'react';
import { Button } from 'antd';
const Recoding = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
    <div>
      <Button type='primary' onClick={handleRecordStart} disabled={isRecording}>
        开始录音
      </Button>
      <Button type='primary' onClick={handleRecordStop} disabled={!isRecording}>
        停止录音
      </Button>
    </div>
  );
};

export default Recoding;
