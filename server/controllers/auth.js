const crypto = require('crypto');
const User = require('../models/user');
const Medication = require('../models/medication');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { buildVerificationEmail } = require('../utils/mailTemplates');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (unverified by default)
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || 'patient', // Default to patient if no role specified
      phoneNumber,
      isVerified: false
    });

    // Save user first so we have an _id
    await user.save();

  // Generate a verification token (raw) and store a hashed version in DB for security
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.verificationToken = hashedToken; // store hashed token
  user.verificationTokenExpires = verificationExpiry;
  user.lastVerificationSentAt = new Date();
  await user.save();

  // Send verification email (nodemailer if SMTP configured; otherwise log link) with raw token
  await sendVerificationEmail(user, rawToken);

  // Return minimal response — client should prompt user to check email
  res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
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

    // Ensure email is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified. Please check your inbox for a verification email.' });
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

// Verify email using token (from query or body)
exports.verifyEmail = async (req, res) => {
  try {
  const token = req.body.token || req.query.token;
  if (!token) return res.status(400).json({ message: 'Verification token is required' });

  // Hash incoming token and find matching user (DB stores hashed token)
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ verificationToken: hashed, verificationTokenExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired verification token' });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Optionally sign the user in automatically after verification
    const tokenStr = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

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
    res.cookie('accessToken', tokenStr, accessCookieOptions)

    res.json({ message: 'Email verified and logged in', user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying email', error: err.message });
  }
};

// Resend verification email
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    // Allow up to N tries within a window before enforcing a cooldown of 1 hour
    const MAX_TRIES = Number(process.env.VERIFICATION_RESEND_MAX_TRIES) || 6;
    const WINDOW_MS = Number(process.env.VERIFICATION_RESEND_WINDOW_MS) || (60 * 60 * 1000); // default 1 hour window
    const COOLDOWN_MS = Number(process.env.VERIFICATION_RESEND_COOLDOWN_MS) || (60 * 60 * 1000); // cooldown 1 hour

    const now = Date.now();

    // Reset window if it expired
    if (!user.resendWindowStart || (now - new Date(user.resendWindowStart).getTime()) > WINDOW_MS) {
      user.resendAttemptCount = 0;
      user.resendWindowStart = new Date();
    }

    // Increment attempt count and persist
    user.resendAttemptCount = (user.resendAttemptCount || 0) + 1;

    // If attempts exceed max, enforce cooldown and tell user to come back in 1 hour
    if (user.resendAttemptCount > MAX_TRIES) {
      user.lastVerificationSentAt = new Date();
      await user.save();
      const retryAfterSeconds = Math.ceil(COOLDOWN_MS / 1000);
      res.set('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({ message: 'Too many verification requests. Please come back in 1 hour.' });
    }

    // Generate new raw token and hashed token for storage
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = hashedToken;
    user.verificationTokenExpires = verificationExpiry;
    user.lastVerificationSentAt = new Date();
    await user.save();

    await sendVerificationEmail(user, rawToken);
    res.json({ message: 'Verification email resent' });
  } catch (err) {
    res.status(500).json({ message: 'Error resending verification email', error: err.message });
  }
};

// Helper: send verification email. If SMTP is configured, uses nodemailer; otherwise logs the link to console.
async function sendVerificationEmail(user, token) {
  try {
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${frontend.replace(/\/$/, '')}/verify-email?token=${token}`;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Use nodemailer
      const nodemailer = require('nodemailer');
      // Configure transporter with sensible timeouts so connection failures surface quickly
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        // reduce default socket timeouts so problems are detected faster in dev
        connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS) || 5000,
        greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS) || 5000,
        socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS) || 5000,
      });

      const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER;

      // Build email bodies from reusable template helper
      const { subject, text, html } = buildVerificationEmail(user, verificationUrl, token);

      const mailOptions = {
        from: fromAddress,
        to: user.email,
        subject,
        text,
        html
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        // If using Ethereal or similar, log preview URL
        if (nodemailer.getTestMessageUrl) {
          const preview = nodemailer.getTestMessageUrl(info);
          if (preview) console.log('Email preview URL:', preview);
        }
        return true;
      } catch (sendErr) {
        console.error('Primary SMTP send failed:', sendErr && sendErr.message ? sendErr.message : sendErr);

        // For common network errors in dev (ETIMEDOUT, ECONNREFUSED, EAI_AGAIN), fallback to Ethereal test account
        const fallbackErrors = ['ETIMEDOUT', 'ECONNREFUSED', 'EAI_AGAIN', 'ENOTFOUND'];
        if (fallbackErrors.includes(sendErr && sendErr.code)) {
          try {
            console.warn('Falling back to Nodemailer Ethereal test account for dev preview');
            const testAccount = await nodemailer.createTestAccount();
            const testTransport = nodemailer.createTransport({
              host: testAccount.smtp.host,
              port: testAccount.smtp.port,
              secure: testAccount.smtp.secure,
              auth: {
                user: testAccount.user,
                pass: testAccount.pass
              }
            });

            const info2 = await testTransport.sendMail(mailOptions);
            const preview = nodemailer.getTestMessageUrl(info2);
            console.log('Ethereal preview URL:', preview);
            return true;
          } catch (ethErr) {
            console.error('Ethereal fallback also failed:', ethErr && ethErr.message ? ethErr.message : ethErr);
            // let outer catch handle returning false
          }
        }

        // not recoverable here - bubble up to outer catch
        throw sendErr;
      }
    } else {
      console.log('--- NO SMTP CONFIGURED: verification link ---');
      console.log(`To: ${user.email}`);
      console.log('Verification URL:', verificationUrl);
      console.log('Verification token:', token);
      console.log('--- END verification link ---');
      return false;
    }
  } catch (err) {
    console.error('Error sending verification email:', err.message);
    return false;
  }
}