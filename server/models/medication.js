const mongoose = require('mongoose');
const { encryptField, decryptField } = require('../utils/encryption');

// Medication schema — encrypt sensitive fields at rest
const medicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // drugName is PHI/PII related to a user's medical treatment — encrypt at rest
  drugName: { type: String, required: true, trim: true, set: encryptField, get: decryptField },
  // dosage may contain sensitive prescription details — encrypt at rest
  dosage: { type: String, required: true, set: encryptField, get: decryptField },
  schedule: {
    // times: encrypt each time entry. We store encrypted strings.
    times: [{ type: String, set: encryptField, get: decryptField }], // e.g. ['08:00', '20:00']
    frequency: { type: String, default: 'daily' } // frequency is non-sensitive operational data
  },
  startDate: { type: Date },
  endDate: { type: Date },
  timezone: { type: String },
  // notes may contain PHI — encrypt at rest
  notes: { type: String, set: encryptField, get: decryptField },
  active: { type: Boolean, default: true }
}, { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } });

module.exports = mongoose.model('Medication', medicationSchema);
