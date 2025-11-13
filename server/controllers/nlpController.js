const nlpService = require('../services/nlpService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * Extract filters from natural language
 */
const extractFilters = async (req, res, next) => {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message) {
      return sendError(res, new Error('Message is required'), 400);
    }

    const filters = await nlpService.extractFiltersFromText(
      message,
      conversationHistory || []
    );
    
    sendSuccess(res, filters);
  } catch (error) {
    next(error);
  }
};

/**
 * Generate chatbot response
 */
const generateChatResponse = async (req, res, next) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return sendError(res, new Error('Message is required'), 400);
    }

    const response = await nlpService.generateChatResponse(message, context || {});
    
    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  extractFilters,
  generateChatResponse,
};