const Medication = require('../models/medication');

exports.createMedication = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { drugName, dosage, schedule, startDate, endDate, timezone, notes } = req.body;

    const med = new Medication({
      userId,
      drugName,
      dosage,
      schedule,
      startDate,
      endDate,
      timezone,
      notes
    });

    await med.save();
    res.status(201).json({ medication: med });
  } catch (err) {
    res.status(500).json({ message: 'Error creating medication', error: err.message });
  }
};

exports.getMedications = async (req, res) => {
  try {
    const user = req.user;
    const { patientId } = req.query;

    let query = {};

    // Patients see their own medications. Caregivers/admins may query by patientId.
    if (user.role === 'patient') {
      query.userId = user.userId;
    } else if (patientId) {
      query.userId = patientId;
    }

    const meds = await Medication.find(query).sort({ createdAt: -1 });
    res.json({ medications: meds });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching medications', error: err.message });
  }
};

exports.getMedicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const med = await Medication.findById(id);
    if (!med) return res.status(404).json({ message: 'Medication not found' });

    // Ownership check for patients
    if (req.user.role === 'patient' && med.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ medication: med });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching medication', error: err.message });
  }
};

exports.updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const med = await Medication.findById(id);
    if (!med) return res.status(404).json({ message: 'Medication not found' });

    // Ownership check for patients
    if (req.user.role === 'patient' && med.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(med, req.body);
    await med.save();
    res.json({ medication: med });
  } catch (err) {
    res.status(500).json({ message: 'Error updating medication', error: err.message });
  }
};

exports.deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const med = await Medication.findById(id);
    if (!med) return res.status(404).json({ message: 'Medication not found' });

    if (req.user.role === 'patient' && med.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await med.deleteOne();
    res.json({ message: 'Medication deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting medication', error: err.message });
  }
};
