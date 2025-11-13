const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { validatePropertyQuery } = require('../middleware/validator');

router.get('/', validatePropertyQuery, propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);

module.exports = router;