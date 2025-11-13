import apiClient from './apiClient';

/**
 * Property service
 */
export const propertyService = {
  getProperties: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== 'any' && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    const response = await apiClient.get(`/properties?${params.toString()}`);
    return response.data;
  },

  getProperty: async (id) => {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },
};

/**
 * Preference service
 */
export const preferenceService = {
  getPreferences: async (userId) => {
    const response = await apiClient.get(`/preferences/${userId}`);
    return response.data;
  },

  savePreferences: async (userId, data) => {
    const response = await apiClient.post(`/preferences`, { userId, ...data });
    return response.data;
  },

  saveProperty: async (userId, propertyId) => {
    const response = await apiClient.post(`/preferences/${userId}/save`, { propertyId });
    return response.data;
  },

  removeProperty: async (userId, propertyId) => {
    const response = await apiClient.delete(`/preferences/${userId}/save/${propertyId}`);
    return response.data;
  },
};

/**
 * NLP service
 */
export const nlpService = {
  extractFilters: async (message, conversationHistory = []) => {
    const response = await apiClient.post('/nlp/extract', { message, conversationHistory });
    return response.data;
  },

  generateResponse: async (message, context = {}) => {
    const response = await apiClient.post('/nlp/chat', { message, context });
    return response.data;
  },
};