/**
 * Utility helper functions
 */
export const formatCurrency = (amount) => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatNumber = (num) => {
  if (!num) return 'N/A';
  return new Intl.NumberFormat('en-US').format(num);
};

export const getPropertyId = (property) => {
  return property._id || property.id;
};

export const isPropertySaved = (property, savedProperties) => {
  const propId = getPropertyId(property);
  return savedProperties.some(sp => getPropertyId(sp) === propId);
};

export const isPropertyComparing = (property, comparedProperties) => {
  const propId = getPropertyId(property);
  return comparedProperties.some(cp => getPropertyId(cp) === propId);
};