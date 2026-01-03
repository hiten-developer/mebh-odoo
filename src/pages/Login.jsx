import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Auth.css'

const Login = ({ setIsAuthenticated, setUserRole }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    loginId: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const staticUsers = [
    { 
      loginId: '01202300010001', 
      password: 'admin123', 
      role: 'admin', 
      name: 'Admin User',
      email: 'admin@dayflow.com',
      company: 'Dayflow Solutions'
    },
    { 
      loginId: '01202300020001', 
      password: 'hr123456', 
      role: 'hr', 
      name: 'HR Manager',
      email: 'hr@dayflow.com',
      company: 'Dayflow Solutions'
    },
    { 
      loginId: '01202300030001', 
      password: 'employee123', 
      role: 'employee', 
      name: 'John Doe',
      email: 'employee@dayflow.com',
      company: 'Dayflow Solutions'
    }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const user = staticUsers.find(u => 
      u.loginId === formData.loginId && u.password === formData.password
    )

    setTimeout(() => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('isAuthenticated', 'true')
        setIsAuthenticated(true)
        setUserRole(user.role)
        
        navigate('/dashboard')
      } else {
        setError('Invalid Login ID or Password')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="auth-card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="auth-header">
          <motion.div 
            className="logo-container"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gradient)" stroke="url(#gradient)" strokeWidth="2"/>
                <path d="M2 17L12 22L22 17" stroke="url(#gradient)" strokeWidth="2"/>
                <path d="M2 12L12 17L22 12" stroke="url(#gradient)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
          
          <motion.h1 
            className="auth-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Human Resource Management System
          </motion.h1>
          
          <motion.div 
            className="auth-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="pulse-dot"></span>
            Sign in Page
          </motion.div>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="auth-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="form-group floating-label">
            <input
              type="text"
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
              className="form-input"
              placeholder=" "
              required
            />
            <label className="floating-label-text">
              <span className="label-icon">👤</span>
              Login ID
              <span className="label-date">12/8/2021.0</span>
            </label>
            <div className="input-line"></div>
          </div>

          <div className="form-group floating-label">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder=" "
              required
            />
            <label className="floating-label-text">
              <span className="label-icon">🔒</span>
              Password
            </label>
            <div className="input-line"></div>
            <div className="password-hint">0007.0</div>
          </div>

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <span className="error-icon">⚠️</span>
              {error}
            </motion.div>
          )}

          <motion.button 
            type="submit" 
            className="btn btn-primary auth-btn"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              <>
                <span className="btn-icon">→</span>
                Sign In
              </>
            )}
          </motion.button>

          <motion.div 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="auth-link">
              <span>Don't have an Account? </span>
              <Link to="/signup" className="link">
                <motion.span
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Sign Up →
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </motion.form>

        <motion.div 
          className="quick-login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="quick-login-title">Quick Login (Testing)</div>
          <div className="quick-login-buttons">
            <button 
              className="quick-btn admin"
              onClick={() => {
                setFormData({
                  loginId: '01202300010001',
                  password: 'admin123'
                })
              }}
            >
              Admin
            </button>
            <button 
              className="quick-btn hr"
              onClick={() => {
                setFormData({
                  loginId: '01202300020001',
                  password: 'hr123456'
                })
              }}
            >
              HR
            </button>
            <button 
              className="quick-btn employee"
              onClick={() => {
                setFormData({
                  loginId: '01202300030001',
                  password: 'employee123'
                })
              }}
            >
              Employee
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Background Animation */}
      <div className="background-animation">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </motion.div>
  )
}

export default Login