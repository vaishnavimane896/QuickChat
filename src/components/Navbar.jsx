import React, { useContext } from 'react'
import './Navbar.css';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext)
  const avatarSrc = currentUser?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || "U")}&background=7c5cfc&color=fff`

  return (
    <div className='navbar'>
      <span className='logo'>ChatApp</span>
      <div className="user">
        <img src={avatarSrc} alt='avatar' />
        <span>{currentUser?.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
