const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, me, deleteAccount } = require('../controllers/auth');
const { authenticate } = require('../middleware/authenticate');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticate, me);
router.post('/delete', authenticate, deleteAccount);

module.exports = router;