import React, { useContext } from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import { AuthContext } from './context/AuthContext'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  const { currentUser, loading } = useContext(AuthContext)

  if (loading) return null

  const ProtectRoute = ({ children }) => {
    if (!currentUser) return <Navigate to="/login" />
    return children
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={<ProtectRoute><Home /></ProtectRoute>} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
