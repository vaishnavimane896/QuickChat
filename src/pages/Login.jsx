import React, { useState, useContext, useEffect } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../Firebase';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [err, setErr] = useState(false)
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    if (currentUser) navigate("/")
  }, [currentUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setErr(true)
    }
  }

  return (
    <div className='fromcontainer'>
      <div className='fromwrapper'>
        <span className='logo'>ChatApp</span>
        <span className='title'>Login</span>
        <form onSubmit={handleSubmit}>
          <input type='email' placeholder='Email' required />
          <input type='password' placeholder='Password' required />
          <button>Sign in</button>
          {err && <span>Wrong email or password.</span>}
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}

export default Login
