import React from 'react'
import { motion } from 'framer-motion'

const Leave = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-container"
    >
      <h1>Profile Page</h1>
      <p>Coming soon...</p>
    </motion.div>
  )
}

export default Leave