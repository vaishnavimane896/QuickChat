import React, { useContext, useEffect, useRef } from 'react';
import './Message.css';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../Context/Chatcontext';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isOwner = message.senderId === currentUser.uid;

  const ownerPhoto = currentUser.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || "U")}&background=3b4aff&color=fff`;
  const otherPhoto = data.user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user?.displayName || "U")}&background=7c5cfc&color=fff`;

  return (
    <div ref={ref} className={`message ${isOwner ? "outgoing" : ""}`}>
      <div className="messageinfo">
        <img src={isOwner ? ownerPhoto : otherPhoto} alt='avatar' />
        <span>Just now</span>
      </div>
      <div className="massagecontact">
        {message.text && <p>{String(message.text)}</p>}
        {message.img && <img src={message.img} alt='attachment' />}
      </div>
    </div>
  );
};

export default Message;
