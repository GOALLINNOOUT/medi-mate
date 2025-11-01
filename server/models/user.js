// Secure Mongoose User schema
// - AES-256 encryption of PII fields using crypto-js
// - bcrypt hashing of passwords (salt rounds = 12)
// - getters decrypt encrypted fields automatically
// Notes:
// - This file uses CommonJS to match the project's existing modules. If you migrate the server to ESM,
//   replace the final `module.exports` with `export default`.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Normalizing + encrypting helpers for common fields

function encryptAndTrim(v) {
  if (!v) return v;
  return encryptField(String(v).trim());
}

function encryptPhone(v) {
  if (!v) return v;
  // normalize to digits + plus
  const norm = String(v).replace(/[^+\d]/g, '');
  return encryptField(norm);
}
// central encryption helpers
const { encryptField, decryptField, normalizeEmail, computeEmailHash } = require('../utils/encryption');

// Build schema: retain original fields but encrypt PII fields (email, firstName, lastName, phoneNumber)
const userSchema = new mongoose.Schema({
  email: {
    set: function(v) {
      // normalize, compute emailHash for deterministic lookup, then encrypt normalized value for storage
      const norm = normalizeEmail(v);
      // set emailHash on the document for indexable lookup
      try {
        this.emailHash = computeEmailHash(norm);
      } catch (e) {
        // fallback: leave emailHash unset; consumer will need to handle
      }
      return encryptField(norm);
    },
    required: [true, 'Email is required'],
  // unique enforced via emailHash for searchable/indexable identifier
  unique: false,
  // store normalized encrypted value
    get: decryptField,
    trim: true,
    // Validator decrypts before checking
    validate: {
      validator: function(v) {
        try {
          const dec = decryptField(v);
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dec);
        } catch (e) {
          return false;
        }
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  // emailHash: store a deterministic hash of the normalized email (sha256).
  // This field allows lookups by email without storing the plaintext or deterministic ciphertext.
  emailHash: {
    type: String,
    index: true,
    unique: true,
    select: false
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  role: {
    type: String,
    enum: ['patient', 'caregiver', 'doctor', 'admin'],
    default: 'patient'
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    set: encryptAndTrim,
    get: decryptField
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    set: encryptAndTrim,
    get: decryptField
  },
  phoneNumber: {
    type: String,
    set: encryptPhone,
    get: decryptField,
    validate: {
      validator: function(v) {
        try {
          const dec = decryptField(v);
          return /^\+?[\d\s-]{10,}$/.test(dec);
        } catch (e) {
          return false;
        }
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  // Email verification fields
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpires: {
    type: Date
  },
  // Track when the last verification email was sent to enforce resend cooldowns
  lastVerificationSentAt: {
    type: Date
  },
  // Track per-user resend attempt counts and window start for throttling
  resendAttemptCount: {
    type: Number,
    default: 0
  },
  resendWindowStart: {
    type: Date
  },
  fcmTokens: [{
    type: String,
    required: false
  }],
  caregivers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Virtual fullName that returns decrypted firstName + lastName
userSchema.virtual('fullName').get(function() {
  const f = this.firstName || '';
  const l = this.lastName || '';
  return `${f} ${l}`.trim();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

// Method to add FCM token
userSchema.methods.addFCMToken = async function(token) {
  if (!this.fcmTokens.includes(token)) {
    this.fcmTokens.push(token);
    await this.save();
  }
};

// Method to remove FCM token
userSchema.methods.removeFCMToken = async function(token) {
  this.fcmTokens = this.fcmTokens.filter(t => t !== token);
  await this.save();
};

const User = mongoose.model('User', userSchema);

// CommonJS export for the existing codebase. If you migrate to ESM, replace with `export default User`.
module.exports = User;