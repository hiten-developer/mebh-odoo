import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { generateLoginId, generateRandomPassword } from '../utils/helpers'
import './Auth.css'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [generatedLoginId, setGeneratedLoginId] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  const generateCredentials = () => {
    if (!formData.companyName || !formData.name) {
      setError('Please enter Company Name and Employee Name first')
      return
    }

    const loginId = generateLoginId(formData.companyName, formData.name)
    const password = generateRandomPassword()
    
    setGeneratedLoginId(loginId)
    setGeneratedPassword(password)
    
    setFormData(prev => ({
      ...prev,
      password: password,
      confirmPassword: password
    }))
    
    setSuccess('Login ID and Password generated successfully!')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    setTimeout(() => {
      const newUser = {
        id: Date.now(),
        loginId: generatedLoginId || generateLoginId(formData.companyName, formData.name),
        email: formData.email,
        password: formData.password,
        role: 'employee',
        name: formData.name,
        company: formData.companyName,
        phone: formData.phone,
        department: 'To be assigned',
        position: 'New Employee'
      }

      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      existingUsers.push(newUser)
      localStorage.setItem('users', JSON.stringify(existingUsers))

      setSuccess('Account created successfully! Redirecting to login...')
      setLoading(false)

      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }, 1500)
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
            Sign Up Page
          </motion.div>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="auth-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="form-row">
            <div className="form-group floating-label">
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="form-input"
                placeholder=" "
                required
              />
              <label className="floating-label-text">
                <span className="label-icon">🏢</span>
                Company Name
              </label>
              <div className="input-line"></div>
            </div>

            <div className="form-group floating-label">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder=" "
                required
              />
              <label className="floating-label-text">
                <span className="label-icon">👤</span>
                Full Name
              </label>
              <div className="input-line"></div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group floating-label">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder=" "
                required
              />
              <label className="floating-label-text">
                <span className="label-icon">✉️</span>
                Email Address
              </label>
              <div className="input-line"></div>
            </div>

            <div className="form-group floating-label">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder=" "
                required
              />
              <label className="floating-label-text">
                <span className="label-icon">📱</span>
                Phone Number
              </label>
              <div className="input-line"></div>
            </div>
          </div>

          <div className="form-row">
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
                <span className="label-icon">🔑</span>
                Password
              </label>
              <div className="input-line"></div>
            </div>

            <div className="form-group floating-label">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder=" "
                required
              />
              <label className="floating-label-text">
                <span className="label-icon">✅</span>
                Confirm Password
              </label>
              <div className="input-line"></div>
            </div>
          </div>

          {generatedLoginId && (
            <motion.div 
              className="generated-credentials"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="credential-item">
                <span className="cred-label">Login ID:</span>
                <span className="cred-value pulse-text">{generatedLoginId}</span>
              </div>
              <div className="credential-item">
                <span className="cred-label">Password:</span>
                <span className="cred-value pulse-text">{generatedPassword}</span>
              </div>
            </motion.div>
          )}

          <motion.div 
            className="button-group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              type="button"
              className="btn btn-secondary"
              onClick={generateCredentials}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="btn-icon">🎯</span>
              Generate Credentials
            </motion.button>
            
            <motion.button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !formData.password}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Sign Up
                </>
              )}
            </motion.button>
          </motion.div>

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

          {success && (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <span className="success-icon">✅</span>
              {success}
            </motion.div>
          )}

          <motion.div 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="auth-link">
              <span>Already have an account? </span>
              <Link to="/login" className="link">
                <motion.span
                  whileHover={{ x: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  ← Sign In
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </motion.form>
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

export default Signup