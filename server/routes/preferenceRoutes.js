const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');
const { validateUserId } = require('../middleware/validator');

router.get('/:userId', validateUserId, preferenceController.getUserPreferences);
router.post('/', validateUserId, preferenceController.saveUserPreferences);
router.post('/:userId/save', validateUserId, preferenceController.saveProperty);
router.delete('/:userId/save/:propertyId', validateUserId, preferenceController.removeProperty);

module.exports = router;