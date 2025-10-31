const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  // Access tokens valid ~24 hours per project spec
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const generateRefreshToken = (userId) => {
  // Use a separate refresh secret if provided, otherwise fall back to JWT_SECRET
  const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  return jwt.sign(
    { userId },
    refreshSecret,
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
};

const verifyRefreshToken = (token) => {
  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    return jwt.verify(token, refreshSecret);
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken
};