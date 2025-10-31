const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorize');
const medicationController = require('../controllers/medication');

// All routes require authentication
router.use(authenticate);

// Create medication (patients create for themselves)
router.post('/', medicationController.createMedication);

// Get medications (patients => own; caregivers/admins can query patientId)
router.get('/', authorizeRoles('patient', 'caregiver', 'admin', 'doctor'), medicationController.getMedications);

router.get('/:id', authorizeRoles('patient', 'caregiver', 'admin', 'doctor'), medicationController.getMedicationById);
router.patch('/:id', authorizeRoles('patient', 'caregiver', 'admin'), medicationController.updateMedication);
router.delete('/:id', authorizeRoles('patient', 'caregiver', 'admin'), medicationController.deleteMedication);

module.exports = router;
