const express = require('express');
const router = express.Router();
const nlpController = require('../controllers/nlpController');

router.post('/extract', nlpController.extractFilters);
router.post('/chat', nlpController.generateChatResponse);

module.exports = router;