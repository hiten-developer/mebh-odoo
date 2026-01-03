import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarToday,
  CheckCircle,
  Cancel,
  Schedule,
  Download,
  FilterList,
  Refresh,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
// import '../pages/'

const Attendance = ({ userRole }) => {
  const [view, setView] = useState('monthly')
  const [selectedMonth, setSelectedMonth] = useState('March 2024')
  
  const attendanceData = [
    { date: '01 Mar', status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9 },
    { date: '02 Mar', status: 'present', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: 9.25 },
    { date: '03 Mar', status: 'weekend', checkIn: '--', checkOut: '--', hours: 0 },
    { date: '04 Mar', status: 'present', checkIn: '09:05 AM', checkOut: '05:45 PM', hours: 8.67 },
    { date: '05 Mar', status: 'half-day', checkIn: '09:00 AM', checkOut: '01:00 PM', hours: 4 },
    { date: '06 Mar', status: 'leave', checkIn: '--', checkOut: '--', hours: 0 },
    { date: '07 Mar', status: 'present', checkIn: '08:45 AM', checkOut: '06:15 PM', hours: 9.5 },
  ]

  const monthlyStats = {
    present: 22,
    absent: 2,
    late: 3,
    leave: 4,
    totalHours: 176,
    averageHours: 8.8
  }

  const attendanceStats = [
    { name: 'Present', value: 22, color: '#4CAF50' },
    { name: 'Absent', value: 2, color: '#F44336' },
    { name: 'Leave', value: 4, color: '#2196F3' },
    { name: 'Half-day', value: 2, color: '#FF9800' }
  ]

  const teamAttendance = [
    { name: 'John Doe', present: 24, absent: 1, performance: 'Excellent' },
    { name: 'Jane Smith', present: 22, absent: 3, performance: 'Good' },
    { name: 'Bob Johnson', present: 20, absent: 5, performance: 'Average' },
    { name: 'Alice Brown', present: 25, absent: 0, performance: 'Excellent' }
  ]

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present': return <CheckCircle style={{ color: '#4CAF50' }} />
      case 'absent': return <Cancel style={{ color: '#F44336' }} />
      case 'half-day': return <Schedule style={{ color: '#FF9800' }} />
      case 'leave': return <Cancel style={{ color: '#2196F3' }} />
      case 'weekend': return <span style={{ color: '#9C27B0' }}>🏖️</span>
      default: return null
    }
  }

  const getStatusClass = (status) => {
    switch(status) {
      case 'present': return 'present'
      case 'absent': return 'absent'
      case 'half-day': return 'half-day'
      case 'leave': return 'leave'
      case 'weekend': return 'weekend'
      default: return ''
    }
  }

  return (
    <motion.div 
      className="attendance-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="attendance-header">
        <div className="header-left">
          <h1 className="page-title">Attendance Management</h1>
          <p className="page-subtitle">Track your attendance and working hours</p>
        </div>
        <div className="header-right">
          <div className="header-actions">
            <select 
              className="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option>January 2024</option>
              <option>February 2024</option>
              <option>March 2024</option>
              <option>April 2024</option>
            </select>
            <motion.button 
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FilterList /> Filter
            </motion.button>
            <motion.button 
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download /> Export
            </motion.button>
            <motion.button 
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Refresh /> Refresh
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <motion.div 
          className="stat-card"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="stat-icon present">
            <CalendarToday />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{monthlyStats.present}</h3>
            <p className="stat-label">Days Present</p>
            <div className="stat-trend positive">
              <ArrowUpward /> 2 more than last month
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="stat-card">
            <div className="stat-icon hours">
              <Schedule />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{monthlyStats.totalHours}</h3>
              <p className="stat-label">Total Hours</p>
              <div className="stat-trend">
                {monthlyStats.averageHours} avg/day
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="stat-icon absent">
            <Cancel />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{monthlyStats.absent}</h3>
            <p className="stat-label">Days Absent</p>
            <div className="stat-trend negative">
              <ArrowDownward /> 1 less than last month
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="stat-icon leave">
            <span>🏖️</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{monthlyStats.leave}</h3>
            <p className="stat-label">Leave Days</p>
            <div className="stat-trend">
              2 remaining
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="chart-header">
            <h3>Monthly Attendance Trend</h3>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${view === 'monthly' ? 'active' : ''}`}
                onClick={() => setView('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`toggle-btn ${view === 'weekly' ? 'active' : ''}`}
                onClick={() => setView('weekly')}
              >
                Weekly
              </button>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar 
                  dataKey="hours" 
                  fill="#667eea" 
                  radius={[4, 4, 0, 0]}
                  name="Working Hours"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="chart-header">
            <h3>Attendance Distribution</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {attendanceStats.map((item, index) => (
                <div key={index} className="legend-item">
                  <span 
                    className="legend-color" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="legend-label">{item.name}: {item.value} days</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Attendance Table */}
      <motion.div 
        className="attendance-table-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="card-header">
          <h3>Daily Attendance - {selectedMonth}</h3>
          <div className="table-actions">
            <button className="mark-attendance-btn">Mark Today's Attendance</button>
          </div>
        </div>
        <div className="table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((day, index) => (
                <tr key={index} className={getStatusClass(day.status)}>
                  <td>{day.date}</td>
                  <td>{new Date(`${day.date} 2024`).toLocaleDateString('en-US', { weekday: 'short' })}</td>
                  <td>
                    <div className="status-cell">
                      {getStatusIcon(day.status)}
                      <span className="status-text">{day.status.charAt(0).toUpperCase() + day.status.slice(1)}</span>
                    </div>
                  </td>
                  <td>{day.checkIn}</td>
                  <td>{day.checkOut}</td>
                  <td>
                    <div className="hours-cell">
                      <span className="hours-value">{day.hours}</span>
                      <span className="hours-label">hours</span>
                    </div>
                  </td>
                  <td>
                    <button className="action-btn">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Team Attendance (Admin/HR Only) */}
      {userRole === 'admin' || userRole === 'hr' ? (
        <motion.div 
          className="team-attendance-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-header">
            <h3>Team Attendance Overview</h3>
            <button className="view-team-btn">View Full Team</button>
          </div>
          <div className="team-table">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Days Present</th>
                  <th>Days Absent</th>
                  <th>Attendance %</th>
                  <th>Performance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {teamAttendance.map((employee, index) => (
                  <tr key={index}>
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">
                          {employee.name.charAt(0)}
                        </div>
                        <span className="employee-name">{employee.name}</span>
                      </div>
                    </td>
                    <td>{employee.present}</td>
                    <td>{employee.absent}</td>
                    <td>
                      <div className="percentage-cell">
                        <div className="percentage-bar">
                          <div 
                            className="percentage-fill"
                            style={{ width: `${(employee.present / 25) * 100}%` }}
                          />
                        </div>
                        <span className="percentage-value">
                          {((employee.present / 25) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`performance-badge ${employee.performance.toLowerCase()}`}>
                        {employee.performance}
                      </span>
                    </td>
                    <td>
                      <button className="view-employee-btn">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  )
}

export default Attendance