import React, { useContext, useEffect, useState } from 'react';
import './Chats.css';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../Context/Chatcontext';
import { collection, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../Firebase';

const Chats = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const fetchAllUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const list = [];
      snapshot.forEach((d) => {
        if (d.data().uid !== currentUser.uid) list.push(d.data());
      });
      setUsers(list);
    };
    fetchAllUsers();
  }, [currentUser?.uid]);

  const handleSelect = async (selectedUser) => {
    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    try {
      const chatDoc = await getDoc(doc(db, "chats", combinedId));
      if (!chatDoc.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        await updateDoc(doc(db, "userchats", currentUser.uid), {
          [`${combinedId}.userInfo`]: { uid: selectedUser.uid, displayName: selectedUser.displayName, photoURL: selectedUser.photoURL || "" },
          [`${combinedId}.date`]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userchats", selectedUser.uid), {
          [`${combinedId}.userInfo`]: { uid: currentUser.uid, displayName: currentUser.displayName, photoURL: currentUser.photoURL || "" },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("handleSelect error:", err);
    }

    dispatch({ type: "CHANGE_USER", payload: { selectedUser, currentUser } });
  };

  return (
    <div className='chats'>
      {users.length === 0 && (
        <p style={{ color: '#6b7494', fontSize: '0.8rem', padding: '16px', textAlign: 'center' }}>
          No other users yet
        </p>
      )}
      {users.map((u) => (
        <div className="userchat" key={u.uid} onClick={() => handleSelect(u)}>
          <img
            src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName)}&background=7c5cfc&color=fff`}
            alt=''
          />
          <div className="userchatinfo">
            <span>{u.displayName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
