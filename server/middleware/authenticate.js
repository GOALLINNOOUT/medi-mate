const { verifyToken } = require('../utils/jwt');

// Authenticate middleware accepts access token from either:
// - Authorization: Bearer <token>
// - httpOnly cookie named `accessToken`
const authenticate = (req, res, next) => {
  try {
    let token

    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken
    }

    if (!token) return res.status(401).json({ message: 'Authentication required' })

    const decoded = verifyToken(token)

    // Attach user info to request
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = { authenticate }