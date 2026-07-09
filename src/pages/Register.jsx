import React, { useState } from 'react';
import './Register.css';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '../Firebase';
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value.trim();
    const email = e.target[1].value;
    const password = e.target[2].value;

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7c5cfc&color=fff`;

      await updateProfile(res.user, { displayName, photoURL });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL,
      });

      await setDoc(doc(db, "userchats", res.user.uid), {});

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fromcontainer'>
      <div className='fromwrapper'>
        <span className='logo'>ChatApp</span>
        <span className='title'>Register</span>
        <form onSubmit={handleSubmit}>
          <input type='text' placeholder='Display name' required />
          <input type='email' placeholder='Email' required />
          <input type='password' placeholder='Password (min 6 chars)' required />
          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
          {err && <span>Something went wrong. Try again.</span>}
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
