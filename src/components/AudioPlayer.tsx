import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState, useRef } from 'react';

const AudioPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const audioRef = useRef<any>(null);

  const handlePlayPause = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  return (
    <div>
      <audio controls ref={audioRef} src={src} />
      {/* <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button> */}
      {/* <Button type='primary' shape='circle' onClick={handlePlayPause} icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />} />
      <p>
        Progress: {Math.floor(currentTime)} / {Math.floor(duration)}
      </p> */}
    </div>
  );
};

export default AudioPlayer;
