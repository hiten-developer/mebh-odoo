import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  People, 
  CalendarToday, 
  Paid,
  Notifications,
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
  Cell,
  LineChart,
  Line
} from 'recharts'
import './Dashboard.css'

const EmployeeDashboard = () => {
  const [stats] = useState({
    attendance: 95,
    leavesRemaining: 12,
    tasksCompleted: 45,
    projects: 3
  })

  const attendanceData = [
    { day: 'Mon', present: 8, expected: 8 },
    { day: 'Tue', present: 7.5, expected: 8 },
    { day: 'Wed', present: 8, expected: 8 },
    { day: 'Thu', present: 6, expected: 8 },
    { day: 'Fri', present: 8, expected: 8 },
    { day: 'Sat', present: 4, expected: 4 }
  ]

  const leaveData = [
    { name: 'Paid Leave', value: 8, color: '#8884d8' },
    { name: 'Sick Leave', value: 4, color: '#82ca9d' },
    { name: 'Unpaid Leave', value: 2, color: '#ffc658' }
  ]

  const projectProgress = [
    { month: 'Jan', progress: 30 },
    { month: 'Feb', progress: 45 },
    { month: 'Mar', progress: 60 },
    { month: 'Apr', progress: 75 },
    { month: 'May', progress: 85 },
    { month: 'Jun', progress: 95 }
  ]

  const recentActivities = [
    { id: 1, type: 'leave', text: 'Leave request approved', time: '2 hours ago', status: 'approved' },
    { id: 2, type: 'attendance', text: 'Late check-in recorded', time: '1 day ago', status: 'warning' },
    { id: 3, type: 'payroll', text: 'March salary credited', time: '3 days ago', status: 'success' },
    { id: 4, type: 'meeting', text: 'Team meeting scheduled', time: '1 week ago', status: 'info' }
  ]

  const upcomingEvents = [
    { id: 1, title: 'Team Standup', time: '10:00 AM', date: 'Today' },
    { id: 2, title: 'Project Review', time: '2:00 PM', date: 'Tomorrow' },
    { id: 3, title: 'Training Session', time: '11:00 AM', date: 'Apr 15' }
  ]

  return (
    <motion.div 
      className="dashboard-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <h1 className="dashboard-title">Employee Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card purple-gradient"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="stat-icon">
            <CalendarToday />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.attendance}%</h3>
            <p className="stat-label">Attendance</p>
            <div className="stat-trend positive">
              <ArrowUpward /> 5% from last month
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card violet-gradient"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="stat-icon">
            <Paid />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.leavesRemaining}</h3>
            <p className="stat-label">Leaves Remaining</p>
            <div className="stat-trend">
              3 used this month
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card magenta-gradient"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="stat-icon">
            <TrendingUp />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.tasksCompleted}</h3>
            <p className="stat-label">Tasks Completed</p>
            <div className="stat-trend positive">
              <ArrowUpward /> 12 this week
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card indigo-gradient"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="stat-icon">
            <People />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.projects}</h3>
            <p className="stat-label">Active Projects</p>
            <div className="stat-trend">
              1 completed
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="chart-header">
            <h3>Weekly Attendance</h3>
            <select className="chart-period">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    border: '1px solid #667eea',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="present" 
                  fill="#667eea" 
                  radius={[4, 4, 0, 0]}
                  name="Hours Present"
                />
                <Bar 
                  dataKey="expected" 
                  fill="#764ba2" 
                  radius={[4, 4, 0, 0]}
                  name="Expected Hours"
                  opacity={0.6}
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
            <h3>Leave Balance</h3>
            <span className="total-leaves">14 Days Total</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={leaveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {leaveData.map((item, index) => (
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

      {/* Project Progress */}
      <motion.div 
        className="chart-card full-width"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="chart-header">
          <h3>Project Progress</h3>
          <div className="project-stats">
            <span className="stat-item">On Track: 2</span>
            <span className="stat-item">Delayed: 1</span>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="progress" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bottom Grid */}
      <div className="bottom-grid">
        <motion.div 
          className="info-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-header">
            <h3>Recent Activities</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`activity-item ${activity.status}`}>
                <div className="activity-icon">
                  <Notifications />
                </div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="info-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="card-header">
            <h3>Upcoming Events</h3>
            <button className="add-event-btn">+ Add Event</button>
          </div>
          <div className="events-list">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-item">
                <div className="event-time">
                  <span className="event-hour">{event.time}</span>
                  <span className="event-date">{event.date}</span>
                </div>
                <div className="event-details">
                  <h4 className="event-title">{event.title}</h4>
                  <p className="event-description">Team collaboration meeting</p>
                </div>
                <button className="event-join-btn">Join</button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default EmployeeDashboard