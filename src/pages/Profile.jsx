import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarToday,
  Edit,
  Save,
  CameraAlt,
  AccountBalance,
  School
} from '@mui/icons-material'
import './Profile.css'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+91 9876543210',
    address: '123, Tech Park, Bangalore, India',
    department: 'Engineering',
    position: 'Senior Software Developer',
    employeeId: 'EMP-2023-001',
    joinDate: '2023-01-15',
    salary: '₹85,000',
    education: 'M.Tech in Computer Science',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript']
  })

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to API
  }

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
        <div className="header-left">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal and professional information</p>
        </div>
        <div className="header-right">
          <motion.button
            className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEditing ? (
              <>
                <Save /> Save Changes
              </>
            ) : (
              <>
                <Edit /> Edit Profile
              </>
            )}
          </motion.button>
        </div>
      </div>

      <div className="profile-grid">
        {/* Left Column - Profile Info */}
        <motion.div 
          className="profile-card main-info"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="profile-picture-section">
            <div className="profile-picture">
              <div className="picture-placeholder">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <button className="change-picture-btn">
                <CameraAlt />
              </button>
            </div>
            <div className="profile-name">
              <h2>{userData.name}</h2>
              <span className="profile-role">{userData.position}</span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Employee ID</span>
              <span className="stat-value">{userData.employeeId}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Department</span>
              <span className="stat-value">{userData.department}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Join Date</span>
              <span className="stat-value">{userData.joinDate}</span>
            </div>
          </div>
        </motion.div>

        {/* Middle Column - Personal Details */}
        <motion.div 
          className="profile-card personal-details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <h3>
              <Person /> Personal Details
            </h3>
          </div>
          
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">
                <Email /> Email
              </span>
              {isEditing ? (
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="detail-input"
                />
              ) : (
                <span className="detail-value">{userData.email}</span>
              )}
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <Phone /> Phone
              </span>
              {isEditing ? (
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="detail-input"
                />
              ) : (
                <span className="detail-value">{userData.phone}</span>
              )}
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <LocationOn /> Address
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="detail-input"
                />
              ) : (
                <span className="detail-value">{userData.address}</span>
              )}
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <Work /> Position
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="detail-input"
                />
              ) : (
                <span className="detail-value">{userData.position}</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Other Info */}
        <motion.div 
          className="profile-card other-info"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-header">
            <h3>
              <AccountBalance /> Salary & Benefits
            </h3>
          </div>
          
          <div className="salary-info">
            <div className="salary-item">
              <span className="salary-label">Monthly Salary</span>
              <span className="salary-value">{userData.salary}</span>
            </div>
            <div className="salary-item">
              <span className="salary-label">Annual Package</span>
              <span className="salary-value">₹10,20,000</span>
            </div>
            <div className="salary-item">
              <span className="salary-label">Bank Account</span>
              <span className="salary-value">XXXX-XXXX-1234</span>
            </div>
          </div>

          <div className="card-header mt-30">
            <h3>
              <School /> Education
            </h3>
          </div>
          
          <div className="education-info">
            <div className="education-item">
              <span className="education-degree">{userData.education}</span>
              <span className="education-university">IIT Bombay (2020-2022)</span>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div 
          className="profile-card skills-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header">
            <h3>Skills & Expertise</h3>
          </div>
          
          <div className="skills-list">
            {userData.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
            {isEditing && (
              <button className="add-skill-btn">
                + Add Skill
              </button>
            )}
          </div>
        </motion.div>

        {/* Documents Section */}
        <motion.div 
          className="profile-card documents-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-header">
            <h3>Documents</h3>
            <button className="upload-btn">Upload New</button>
          </div>
          
          <div className="documents-list">
            <div className="document-item">
              <div className="document-icon">📄</div>
              <div className="document-info">
                <span className="document-name">Resume.pdf</span>
                <span className="document-size">2.4 MB</span>
              </div>
              <button className="document-action">Download</button>
            </div>
            <div className="document-item">
              <div className="document-icon">📄</div>
              <div className="document-info">
                <span className="document-name">Offer_Letter.pdf</span>
                <span className="document-size">1.8 MB</span>
              </div>
              <button className="document-action">Download</button>
            </div>
            <div className="document-item">
              <div className="document-icon">📄</div>
              <div className="document-info">
                <span className="document-name">PAN_Card.pdf</span>
                <span className="document-size">0.8 MB</span>
              </div>
              <button className="document-action">Download</button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Profile