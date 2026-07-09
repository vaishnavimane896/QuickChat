import React, { useState, useContext } from 'react';
import './Input.css';
import { doc, updateDoc, arrayUnion, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../Firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../Context/Chatcontext';
import { v4 as uuid } from "uuid";

const Input = () => {
  const [text, setText] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const updateUserChats = async (lastText) => {
    const payload = { text: lastText, date: serverTimestamp() };
    await updateDoc(doc(db, "userchats", currentUser.uid), {
      [`${data.chatId}.lastMessage`]: payload,
      [`${data.chatId}.date`]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userchats", data.user.uid), {
      [`${data.chatId}.lastMessage`]: payload,
      [`${data.chatId}.date`]: serverTimestamp(),
    });
  };

  const handleSend = async () => {
    if (!text.trim() || !data.chatId) return;
    const t = text;
    setText("");
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text: t,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });
    await updateUserChats(t);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSend();
  };

  return (
    <div className='input'>
      <input
        type="text"
        placeholder='Type a message...'
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        value={text}
      />
      <div className='send'>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
