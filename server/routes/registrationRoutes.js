const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.post('/', registrationController.createRegistration);
router.get('/check/:query', registrationController.lookupRegistration);

// Admin-protected routes
router.get('/export/excel', authenticateAdmin, registrationController.exportToExcel);
router.get('/', authenticateAdmin, registrationController.getAllRegistrations);
router.get('/:id', authenticateAdmin, registrationController.getRegistrationById);
router.put('/:id', authenticateAdmin, registrationController.updateRegistration);
router.put('/:id/status', authenticateAdmin, registrationController.updateRegistrationStatus);
router.delete('/:id', authenticateAdmin, registrationController.deleteRegistration);

module.exports = router;
