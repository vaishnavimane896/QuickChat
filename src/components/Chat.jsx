import React, { useContext } from 'react';
import './Chat.css';
import Messages from './Mesagess';
import Input from './Input';
import { ChatContext } from '../Context/Chatcontext';

const Chat = () => {
  const { data } = useContext(ChatContext);

  if (!data.chatId) {
    return (
      <div className='chat' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <p style={{ color: '#6b7494', fontFamily: 'DM Sans, sans-serif' }}>
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className='chat'>
      <div className="chatinfo">
        <span>{data.user?.displayName}</span>
        <div className="chaticons"></div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat
