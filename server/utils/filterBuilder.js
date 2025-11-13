/**
 * Build MongoDB filter object from query parameters
 */
const buildPropertyFilter = (query) => {
    const {
      budget,
      location,
      bedrooms,
      bathrooms,
      minSize,
      maxSize,
      amenities,
    } = query;
  
    const filter = {};
  
    // Only add filters if values are valid and not empty
    if (bedrooms && bedrooms !== '' && !isNaN(parseInt(bedrooms))) {
      const bedroomsNum = parseInt(bedrooms);
      if (bedroomsNum > 0) {
        filter.bedrooms = { $gte: bedroomsNum };
      }
    }
  
    if (bathrooms && bathrooms !== '' && !isNaN(parseInt(bathrooms))) {
      const bathroomsNum = parseInt(bathrooms);
      if (bathroomsNum > 0) {
        filter.bathrooms = { $gte: bathroomsNum };
      }
    }
  
    if (location && location !== '' && location !== 'any') {
      filter.location = { $regex: location, $options: 'i' };
    }
  
    // Only filter by price if budget is provided and valid
    // Note: If properties don't have price set, this might return no results
    if (budget && budget !== '' && !isNaN(parseInt(budget))) {
      const budgetNum = parseInt(budget);
      if (budgetNum > 0) {
        // Check if price exists OR is 0 (default), so we don't filter out all properties
        filter.$or = [
          { price: { $lte: budgetNum } },
          { price: { $exists: false } },
          { price: 0 }
        ];
      }
    }
  
    if (minSize && minSize !== '' && !isNaN(parseInt(minSize))) {
      const minSizeNum = parseInt(minSize);
      if (minSizeNum > 0) {
        if (!filter.size_sqft) filter.size_sqft = {};
        filter.size_sqft.$gte = minSizeNum;
      }
    }
  
    if (maxSize && maxSize !== '' && !isNaN(parseInt(maxSize))) {
      const maxSizeNum = parseInt(maxSize);
      if (maxSizeNum > 0) {
        if (!filter.size_sqft) filter.size_sqft = {};
        filter.size_sqft.$lte = maxSizeNum;
      }
    }
  
    if (amenities && amenities !== '') {
      const amenityList = amenities.split(',').map(a => a.trim()).filter(a => a !== '');
      if (amenityList.length > 0) {
        filter.amenities = { $in: amenityList };
      }
    }
  
    return filter;
  };
  
  module.exports = {
    buildPropertyFilter,
  };