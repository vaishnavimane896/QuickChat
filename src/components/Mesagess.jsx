import React, { useEffect, useState, useContext } from 'react';
import Message from './Message';
import './Messagess.css';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { ChatContext } from '../Context/Chatcontext';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (!data.chatId) return;
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (snap) => {
      if (snap.exists()) setMessages(snap.data().messages || []);
    });
    return () => unsub();
  }, [data.chatId]);

  return (
    <div className='messages'>
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
