import React, { useContext, useState } from 'react';
import './Search.css';
import { collection, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../Context/Chatcontext';

const Search = () => {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState([]);
  const [err, setErr] = useState(false);
  const [searched, setSearched] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    if (!username.trim()) return;
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const found = [];
      snapshot.forEach((d) => {
        const data = d.data();
        if (data.uid !== currentUser.uid &&
            data.displayName?.toLowerCase().includes(username.trim().toLowerCase())) {
          found.push(data);
        }
      });
      setSearched(true);
      if (found.length === 0) { setErr(true); setResults([]); }
      else { setErr(false); setResults(found); }
    } catch (err) {
      console.error(err); setErr(true);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSearch(); };

  const handleSelect = async (user) => {
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try {
      const chatDoc = await getDoc(doc(db, "chats", combinedId));
      if (!chatDoc.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        await updateDoc(doc(db, "userchats", currentUser.uid), {
          [`${combinedId}.userInfo`]: { uid: user.uid, displayName: user.displayName, photoURL: user.photoURL || "" },
          [`${combinedId}.date`]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userchats", user.uid), {
          [`${combinedId}.userInfo`]: { uid: currentUser.uid, displayName: currentUser.displayName, photoURL: currentUser.photoURL || "" },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }
      dispatch({ type: "CHANGE_USER", payload: { selectedUser: user, currentUser } });
    } catch (err) { console.error(err); }
    setResults([]); setUsername(""); setSearched(false);
  };

  return (
    <div className='search'>
      <div className="searchform">
        <input
          type="text"
          placeholder='Search users...'
          onKeyDown={handleKey}
          onChange={(e) => { setUsername(e.target.value); if (!e.target.value) { setResults([]); setErr(false); setSearched(false); } }}
          value={username}
        />
      </div>
      {err && searched && <span style={{ padding: "8px 16px", color: "#f87171", fontSize: "0.8rem", display: "block" }}>No user found</span>}
      {results.map((user) => (
        <div className="userchat" key={user.uid} onClick={() => handleSelect(user)}>
          <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=7c5cfc&color=fff`} alt='' />
          <div className="userchatinfo"><span>{user.displayName}</span></div>
        </div>
      ))}
    </div>
  );
};

export default Search;
