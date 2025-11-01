const User = require('../models/user');
const Medication = require('../models/medication');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || 'patient', // Default to patient if no role specified
      phoneNumber
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token in httpOnly cookie and also set short-lived access token cookie
    const refreshCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }

    // access token cookie: shorter lived (e.g., 15 minutes)
    const accessCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    }

    res.cookie('refreshToken', refreshToken, refreshCookieOptions)
    res.cookie('accessToken', token, accessCookieOptions)

    // Return user data only (token is sent via httpOnly cookie)
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token and short-lived access token in httpOnly cookies
    const refreshCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
    const accessCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    }

    res.cookie('refreshToken', refreshToken, refreshCookieOptions)
    res.cookie('accessToken', token, accessCookieOptions)

    // Return user data only (access token is in httpOnly cookie)
    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new access token and set it in an httpOnly cookie
    const token = generateToken(user._id, user.role)

    const accessCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    }

    res.cookie('accessToken', token, accessCookieOptions)

    // Return user data so client can update state without needing to parse cookies
    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    })
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

exports.logout = (req, res) => {
  // Clear cookies using matching options (except maxAge)
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }

  res.clearCookie('refreshToken', cookieOptions)
  res.clearCookie('accessToken', cookieOptions)
  res.json({ message: 'Logged out successfully' })
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password -fcmTokens');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// GDPR: Right to erasure — delete user and related data
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Delete related medications
    await Medication.deleteMany({ userId });

    // TODO: Delete moods, notifications, reports, Cloudinary files, and revoke Firebase tokens as needed

    // Delete user record
    await User.findByIdAndDelete(userId);

    // Clear cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }

    res.clearCookie('refreshToken', cookieOptions)
    res.clearCookie('accessToken', cookieOptions)

    res.json({ message: 'Account deleted and associated data removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting account', error: err.message });
  }
};