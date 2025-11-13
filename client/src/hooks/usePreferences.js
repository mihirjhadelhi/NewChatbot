import { useState, useCallback, useEffect } from 'react';
import { preferenceService } from '../services/api';

/**
 * Custom hook for user preferences
 */
export const usePreferences = (userId) => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadSavedProperties = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await preferenceService.getPreferences(userId);
      if (response.success && response.data) {
        setSavedProperties(response.data.savedProperties || []);
      }
    } catch (error) {
      console.error('Error loading saved properties:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadSavedProperties();
  }, [loadSavedProperties]);

  const saveProperty = useCallback(async (propertyId) => {
    try {
      await preferenceService.saveProperty(userId, propertyId);
      await loadSavedProperties();
      return true;
    } catch (error) {
      console.error('Error saving property:', error);
      return false;
    }
  }, [userId, loadSavedProperties]);

  const removeProperty = useCallback(async (propertyId) => {
    try {
      await preferenceService.removeProperty(userId, propertyId);
      await loadSavedProperties();
      return true;
    } catch (error) {
      console.error('Error removing property:', error);
      return false;
    }
  }, [userId, loadSavedProperties]);

  return {
    savedProperties,
    isLoading,
    saveProperty,
    removeProperty,
    refresh: loadSavedProperties,
  };
};