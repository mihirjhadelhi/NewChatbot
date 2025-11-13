const Property = require('../models/Property');
const { buildPropertyFilter } = require('../utils/filterBuilder');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * Get all properties with optional filters
 */
const getProperties = async (req, res, next) => {
  try {
    const filter = buildPropertyFilter(req.query);
    
    console.log('Search filters:', filter); // Debug log
    
    // If no filters, return all properties (or limit to prevent huge responses)
    const properties = await Property.find(filter).limit(50);
    
    console.log(`Found ${properties.length} properties`); // Debug log
    
    sendSuccess(res, properties, `Found ${properties.length} properties`, 200);
  } catch (error) {
    console.error('Error in getProperties:', error);
    next(error);
  }
};

/**
 * Get single property by ID
 */
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findOne({ id: parseInt(req.params.id) });
    
    if (!property) {
      return sendError(res, new Error('Property not found'), 404);
    }
    
    sendSuccess(res, property);
  } catch (error) {
    console.error('Error in getPropertyById:', error);
    next(error);
  }
};

module.exports = {
  getProperties,
  getPropertyById,
};