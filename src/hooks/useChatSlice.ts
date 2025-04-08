import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { createSession, sendMessage, closeSession } from '../store/chat/chatSlice';

const useChatSlice = (receiverID: number) => {
  const dispatch = useDispatch();
  const { isConnected, messageList, sessionID } = useSelector((state: RootState) => state.chat);

  const createSessionAction = () => {
    dispatch(createSession({ receiverID }));
  };

  const sendMsgAction = (data: { content: string; contentType: ContentTypes }) => {
    dispatch(sendMessage(data));
  };

  const closeSessionAction = () => {
    dispatch(closeSession());
  };

  return {
    isConnected,
    messageList,
    sessionID,
    createSession: createSessionAction,
    sendMsg: sendMsgAction,
    closeSession: closeSessionAction,
  };
};

export default useChatSlice;
