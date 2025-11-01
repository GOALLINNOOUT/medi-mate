const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, me, deleteAccount, verifyEmail, resendVerification, forgotPassword, resetPassword } = require('../controllers/auth');
const rateLimit = require('express-rate-limit');

// Basic IP-level rate limiter for resend-verification to reduce abuse
const resendLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 6, // limit each IP to 6 requests per windowMs
	standardHeaders: true,
	legacyHeaders: false,
	message: 'Too many requests from this IP, please try again later.'
});
const { authenticate } = require('../middleware/authenticate');

// Public routes
router.post('/register', register);
router.post('/login', login);
// Email verification endpoints
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendLimiter, resendVerification);
// Password reset endpoints
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticate, me);
router.post('/delete', authenticate, deleteAccount);

module.exports = router;