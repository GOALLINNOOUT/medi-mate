const crypto = require('crypto');

// AES-256-GCM field-level encryption helper
// Expects process.env.ENCRYPTION_KEY to be a 32-byte key encoded as base64 or hex.
// Output is base64 of (iv || authTag || ciphertext)

const IV_LENGTH = 12; // recommended for GCM
const AUTH_TAG_LENGTH = 16;

function getKey() {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) throw new Error('ENCRYPTION_KEY env var is required for field encryption');

  // Accept base64 or hex or raw 32-byte string
  // Try base64 first
  try {
    const b = Buffer.from(raw, 'base64');
    if (b.length === 32) return b;
  } catch (e) {}

  try {
    const b = Buffer.from(raw, 'hex');
    if (b.length === 32) return b;
  } catch (e) {}

  // As a fallback, use utf8 bytes (not recommended for production)
  const b = Buffer.from(raw, 'utf8');
  if (b.length === 32) return b;

  throw new Error('ENCRYPTION_KEY must be 32 bytes (base64 or hex recommended)');
}

function encryptField(plaintext) {
  if (plaintext === null || plaintext === undefined) return plaintext;
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const ciphertext = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // concat iv + authTag + ciphertext
  const out = Buffer.concat([iv, authTag, ciphertext]);
  return out.toString('base64');
}

function decryptField(enc) {
  if (enc === null || enc === undefined) return enc;
  const key = getKey();
  const data = Buffer.from(enc, 'base64');
  if (data.length < IV_LENGTH + AUTH_TAG_LENGTH) throw new Error('Invalid encrypted payload');

  const iv = data.slice(0, IV_LENGTH);
  const authTag = data.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = data.slice(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  const result = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return result.toString('utf8');
}

// Normalize email (trim + lowercase)
function normalizeEmail(email) {
  if (!email && email !== '') return email;
  return String(email).trim().toLowerCase();
}

// Deterministic email hash for lookups (sha256 hex)
function computeEmailHash(email) {
  const norm = normalizeEmail(email || '');
  return crypto.createHash('sha256').update(norm).digest('hex');
}

module.exports = {
  encryptField,
  decryptField
  , normalizeEmail
  , computeEmailHash
};
