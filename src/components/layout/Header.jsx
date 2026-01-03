import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Notifications,
  Settings,
  Search,
  Email,
  Brightness4,
  Brightness7,
  Menu
} from '@mui/icons-material'
import './Header.css'

const Header = ({ userName, userRole, toggleDarkMode, isDarkMode, toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const notifications = [
    { id: 1, text: 'New leave request from John Doe', time: '10 min ago', read: false },
    { id: 2, text: 'Attendance report is ready', time: '1 hour ago', read: false },
    { id: 3, text: 'Payroll processed for March', time: '2 days ago', read: true }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <motion.header 
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={toggleSidebar}>
          <Menu />
        </button>
        
        <div className="search-container">
          <Search className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search employees, documents..."
          />
        </div>
      </div>

      <div className="header-right">
        <motion.button 
          className="header-btn theme-toggle"
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </motion.button>

        <div className="notification-container">
          <motion.button 
            className="header-btn notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Notifications />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                className="notification-dropdown"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <button className="mark-all-read">Mark all as read</button>
                </div>
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    >
                      <div className="notification-icon">
                        <Email />
                      </div>
                      <div className="notification-content">
                        <p className="notification-text">{notification.text}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button className="view-all">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button 
          className="header-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Settings />
        </motion.button>

        <div className="user-profile-container">
          <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="profile-avatar">
              {userName?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <span className="profile-name">{userName}</span>
              <span className="profile-role">{userRole}</span>
            </div>
          </div>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div 
                className="user-menu-dropdown"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="menu-item">👤 My Profile</div>
                <div className="menu-item">⚙️ Settings</div>
                <div className="menu-item">🔒 Privacy</div>
                <div className="menu-divider"></div>
                <div className="menu-item logout">🚪 Logout</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}

export default Header