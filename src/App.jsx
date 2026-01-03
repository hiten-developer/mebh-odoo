import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated')
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    
    if (auth === 'true' && userData) {
      setIsAuthenticated(true)
      setUserRole(userData.role)
    }
  }, [])

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
            } 
          />
          <Route 
            path="/login/*" 
            element={
              <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
            } 
          />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard userRole={userRole} /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default App