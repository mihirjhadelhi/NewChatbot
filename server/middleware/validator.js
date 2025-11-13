/**
 * Request validation middleware
 */
const validatePropertyQuery = (req, res, next) => {
    const { budget, bedrooms, bathrooms, minSize, maxSize } = req.query;
  
    // Validate numeric fields - only check if they exist and are not empty
    const numericFields = { budget, bedrooms, bathrooms, minSize, maxSize };
    for (const [key, value] of Object.entries(numericFields)) {
      if (value && value !== '' && isNaN(parseInt(value))) {
        return res.status(400).json({
          success: false,
          error: `${key} must be a valid number`,
        });
      }
    }
  
    next();
  };
  
  const validateUserId = (req, res, next) => {
    if (!req.params.userId && !req.body.userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }
    next();
  };
  
  module.exports = {
    validatePropertyQuery,
    validateUserId,
  };
