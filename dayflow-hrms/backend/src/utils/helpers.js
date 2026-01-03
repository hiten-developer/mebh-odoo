// Helper functions
exports.generateToken = (user) => {
  return require('jsonwebtoken').sign(
    {
      id: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};