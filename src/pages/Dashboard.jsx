import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import EmployeeDashboard from './EmployeeDashboard'
import AdminDashboard from './AdminDashboard'
import Profile from './Profile'
import Attendance from './Attendance'
import Leave from './Leave'
import Payroll from './Payroll'
// import Employees from './Employees'
// import AdminPanel from './AdminPanel'
import './Dashboard.css'

const Dashboard = ({ userRole }) => {
  const [user, setUser] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    setUser(userData)

    // Handle window resize for sidebar
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle('dark-mode', !isDarkMode)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (!user) {
    return null
  }

  return (
    <motion.div 
      className={`dashboard-container ${isDarkMode ? 'dark' : ''} ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Sidebar 
        userRole={userRole} 
        userName={user.name}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      <div className="main-content">
        <Header 
          userName={user.name}
          userRole={userRole}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          toggleSidebar={toggleSidebar}
        />
        
        <div className="content-area">
          <Routes>
            <Route 
              path="/" 
              element={
                userRole === 'employee' ? 
                <EmployeeDashboard /> : 
                <AdminDashboard />
              } 
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/attendance/*" element={<Attendance userRole={userRole} />} />
            <Route path="/leave/*" element={<Leave userRole={userRole} />} />
            <Route path="/payroll" element={<Payroll userRole={userRole} />} />
            {/* {userRole === 'admin' || userRole === 'hr' ? (
              <>
                <Route path="/employees" element={<Employees />} />
                <Route path="/admin" element={<AdminPanel />} />
              </>
            ) : null} */}
          </Routes>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard