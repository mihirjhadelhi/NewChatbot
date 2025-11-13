/**
 * Application constants
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const MAX_COMPARISON_PROPERTIES = 4;
export const DEBOUNCE_DELAY = 500;
export const MIN_SEARCH_LENGTH = 2;

export const FILTER_DEFAULTS = {
  budget: '',
  location: '',
  bedrooms: '',
  bathrooms: '',
  minSize: '',
  maxSize: '',
  amenities: '',
};

export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot',
};