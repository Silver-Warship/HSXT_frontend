import { useRef } from 'react';

const AudioPlayer = ({ src }: { src: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const audioRef = useRef<any>(null);

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
