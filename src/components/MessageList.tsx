import getAudio from '@/utils/getAudio';
import { Button, Flex, Image } from 'antd';
import { useEffect, useRef } from 'react';
import AudioPlayer from './AudioPlayer';

const MessageList = ({
  scroll,
  messageList,
  onCloseSession,
  isAdmin = false,
}: {
  scroll: boolean;
  messageList: UserMessage[];
  onCloseSession: () => void;
  isAdmin?: boolean;
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const _scrollToBottom = () => {
    if (chatContainerRef.current) {
      // chatContainerRef.current.scrollTo(
      //   0,
      //   chatContainerRef.current.scrollHeight
      // );
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(_scrollToBottom, [scroll]);

  const renderContent = (content: string, contentType: ContentTypes) => {
    if (contentType === 'VOICE') {
      return <AudioPlayer src={getAudio(content) ?? ''} />;
    } else if (contentType === 'TEXT') {
      if (content === '/close') {
        return (
          <div>
            <p className='mb-2'>请问您是否希望结束咨询？</p>
            <Button onClick={onCloseSession} type='primary'>
              结束咨询
            </Button>
          </div>
        );
      } else return content;
    } else return content;
  };

  return (
    <div ref={chatContainerRef} className={`w-full overflow-y-auto flex-grow-1`}>
      <Flex vertical>
        {messageList.map(({ messageID: id, role, content, contentType }, index) =>
          role ? (
            <div key={index} className='w-full p-3 pl-[72px]'>
              <Flex gap='small' justify='flex-end' align='flex-start'>
                <div className={`${isAdmin ? 'bg-blue-500 text-white' : 'bg-chat-bg'} p-3 rounded-md break-words text-wrap max-w-[400px]`}>
                  <div className='leading-6'>{renderContent(content, contentType)}</div>
                </div>
                <Image preview={false} className='rounded-full flex-shrink-0' src='/avatar.svg' alt='avatar' width={44} height={44} />
              </Flex>
            </div>
          ) : (
            <div key={id} className='w-full p-3 pr-[72px]'>
              <Flex gap='small' align='flex-start'>
                <Image preview={false} className='rounded-full flex-shrink-0' src='/avatar.svg' alt='avatar' width={44} height={44} />
                <div className={`${isAdmin ? 'bg-gray-100' : 'bg-white'} p-3 rounded-md break-words text-wrap max-w-[400px]`}>
                  <div className='leading-6'>{renderContent(content, contentType)}</div>
                </div>
              </Flex>
            </div>
          ),
        )}
      </Flex>
    </div>
  );
};

export default MessageList;
