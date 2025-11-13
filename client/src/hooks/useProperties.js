import { useState, useCallback } from 'react';
import { propertyService } from '../services/api';

/**
 * Custom hook for property operations
 */
export const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchProperties = useCallback(async (filters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await propertyService.getProperties(filters);
      if (response.success) {
        setProperties(response.data || []);
      } else {
        setError('Failed to fetch properties');
        setProperties([]);
      }
    } catch (err) {
      setError(err.message);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearProperties = useCallback(() => {
    setProperties([]);
    setError(null);
  }, []);

  return {
    properties,
    isLoading,
    error,
    searchProperties,
    clearProperties,
  };
};