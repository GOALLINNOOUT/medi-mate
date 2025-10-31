const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  drugName: { type: String, required: true, trim: true },
  dosage: { type: String, required: true },
  schedule: {
    times: [{ type: String }], // e.g. ['08:00', '20:00']
    frequency: { type: String, default: 'daily' } // daily, weekly, custom
  },
  startDate: { type: Date },
  endDate: { type: Date },
  timezone: { type: String },
  notes: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Medication', medicationSchema);
