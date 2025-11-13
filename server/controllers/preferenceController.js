const UserPreference = require('../models/UserPreference');
const Property = require('../models/Property');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * Get user preferences
 */
const getUserPreferences = async (req, res, next) => {
  try {
    const userPref = await UserPreference.findOne({ userId: req.params.userId })
      .populate('savedProperties');
    
    if (!userPref) {
      return sendSuccess(res, null, 'No preferences found');
    }
    
    sendSuccess(res, userPref);
  } catch (error) {
    next(error);
  }
};

/**
 * Create or update user preferences
 */
const saveUserPreferences = async (req, res, next) => {
  try {
    const { userId, savedProperties, preferences, searchHistory } = req.body;

    let userPref = await UserPreference.findOne({ userId });

    if (userPref) {
      if (savedProperties) userPref.savedProperties = savedProperties;
      if (preferences) userPref.preferences = { ...userPref.preferences, ...preferences };
      if (searchHistory) userPref.searchHistory.push(searchHistory);
      await userPref.save();
    } else {
      userPref = await UserPreference.create({
        userId,
        savedProperties: savedProperties || [],
        preferences: preferences || {},
        searchHistory: searchHistory ? [searchHistory] : [],
      });
    }

    sendSuccess(res, userPref, 'Preferences saved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Save property to favorites
 */
const saveProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return sendError(res, new Error('Property not found'), 404);
    }

    let userPref = await UserPreference.findOne({ userId: req.params.userId });

    if (!userPref) {
      userPref = await UserPreference.create({
        userId: req.params.userId,
        savedProperties: [property._id],
      });
    } else {
      if (!userPref.savedProperties.includes(property._id)) {
        userPref.savedProperties.push(property._id);
        await userPref.save();
      }
    }

    sendSuccess(res, userPref, 'Property saved to favorites');
  } catch (error) {
    next(error);
  }
};

/**
 * Remove property from favorites
 */
const removeProperty = async (req, res, next) => {
  try {
    const userPref = await UserPreference.findOne({ userId: req.params.userId });

    if (userPref) {
      userPref.savedProperties = userPref.savedProperties.filter(
        id => id.toString() !== req.params.propertyId
      );
      await userPref.save();
    }

    sendSuccess(res, userPref, 'Property removed from favorites');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserPreferences,
  saveUserPreferences,
  saveProperty,
  removeProperty,
};