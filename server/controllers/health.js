const mongoose = require('mongoose');

exports.getHealth = (req, res) => {
  const dbState = mongoose.connection && mongoose.connection.readyState;
  const dbConnected = dbState === 1; // 1 = connected

  res.json({
    status: 'ok',
    uptime: process.uptime().toFixed(2),
    env: process.env.NODE_ENV || 'development',
    db: dbConnected,
    timestamp: new Date().toISOString(),
  });
};
