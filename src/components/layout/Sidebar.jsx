import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Dashboard as DashboardIcon,
  People,
  CalendarToday,
  ExitToApp,
  Paid,
  Person,
  Menu,
  Close,
  AdminPanelSettings,
  Work,
  Notifications,
  Settings
} from '@mui/icons-material'
import '../layout/Slidebar.css'

const Sidebar = ({ userRole, userName, isOpen, onToggle }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const isAdminOrHR = userRole === 'admin' || userRole === 'hr'

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      title: 'Profile',
      icon: <Person />,
      path: '/dashboard/profile'
    },
    {
      title: 'Attendance',
      icon: <CalendarToday />,
      path: '/dashboard/attendance'
    },
    {
      title: 'Leave',
      icon: <ExitToApp />,
      path: '/dashboard/leave'
    },
    {
      title: 'Payroll',
      icon: <Paid />,
      path: '/dashboard/payroll'
    }
  ]

  if (isAdminOrHR) {
    menuItems.push(
      {
        title: 'Employees',
        icon: <People />,
        path: '/dashboard/employees'
      },
      {
        title: 'Admin Panel',
        icon: <AdminPanelSettings />,
        path: '/dashboard/admin'
      }
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
    navigate('/login')
  }

  return (
    <>
      {!isOpen && (
        <motion.button
          className="menu-toggle"
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Menu />
        </motion.button>
      )}

      <motion.aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="sidebar-header">
          <div className="sidebar-header-top">
            <div className="user-info">
              <div className="user-avatar">
                <div className="avatar-placeholder">
                  {userName?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="user-details">
                <h3 className="user-name">{userName}</h3>
                <span className={`user-role ${userRole}`}>
                  {userRole === 'admin' && '🏛️ Administrator'}
                  {userRole === 'hr' && '👥 HR Manager'}
                  {userRole === 'employee' && '👨‍💼 Employee'}
                </span>
              </div>
            </div>
            <motion.button
              className="close-sidebar"
              onClick={onToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Close />
            </motion.button>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(item.path)}
            >
              <div className="nav-item-content">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-title">{item.title}</span>
              </div>
            </motion.div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon">
              <ExitToApp />
            </span>
            <span className="nav-title">Logout</span>
          </button>
          
          <div className="app-version">
            <div className="app-name">Dayflow HRMS</div>
            <div className="version-badge">v1.0.0</div>
          </div>
        </div>
      </motion.aside>

      {isOpen && window.innerWidth <= 768 && (
        <motion.div 
          className="sidebar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
        />
      )}
    </>
  )
}

export default Sidebar