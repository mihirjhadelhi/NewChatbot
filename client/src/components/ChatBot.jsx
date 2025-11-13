import { useState, useEffect, useRef, useCallback } from 'react';
import { propertyService, preferenceService, nlpService } from '../services/api';
import PropertyCard from './PropertyCard';
import PropertyComparison from './PropertyComparison';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hi! I'm AgentMeera, your real estate assistant. I can help you find properties using natural language! Try saying 'I need a 3 bedroom house' or use the filters below." }
  ]);
  const [input, setInput] = useState('');
  const [filters, setFilters] = useState({
    budget: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    minSize: '',
    maxSize: '',
    amenities: ''
  });
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [comparedProperties, setComparedProperties] = useState([]);
  const [userId] = useState(() => `user_${Date.now()}`);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    loadSavedProperties();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time search with debouncing
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        performRealTimeSearch(searchQuery);
      }, 500); // 500ms debounce
    } else if (searchQuery.trim().length === 0) {
      setProperties([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSavedProperties = async () => {
    try {
      const response = await preferenceService.getPreferences(userId);
      if (response.success && response.data) {
        setSavedProperties(response.data.savedProperties || []);
      }
    } catch (error) {
      console.error('Error loading saved properties:', error);
    }
  };

  const performRealTimeSearch = async (query) => {
    try {
      // Use NLP to extract filters from query
      const nlpResponse = await nlpService.extractFilters(query, messages);
      if (nlpResponse.success && nlpResponse.data) {
        const extractedFilters = nlpResponse.data;
        const searchFilters = {
          ...filters,
          ...Object.fromEntries(
            Object.entries(extractedFilters).filter(([_, v]) => v !== null)
          )
        };
        
        const response = await propertyService.getProperties(searchFilters);
        if (response.success) {
          setProperties(response.data || []);
        }
      }
    } catch (error) {
      console.error('Real-time search error:', error);
    }
  };

  const handleSearch = async (searchFilters = null) => {
    const activeFilters = searchFilters || filters;
    
    // Remove empty values from filters
    const cleanedFilters = Object.fromEntries(
      Object.entries(activeFilters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );
    
    // Check if we have at least one valid filter
    if (!cleanedFilters.budget && !cleanedFilters.bedrooms && !cleanedFilters.location && 
        !cleanedFilters.bathrooms && !cleanedFilters.minSize && !cleanedFilters.maxSize) {
      addMessage('bot', 'Please provide at least one filter (budget, bedrooms, bathrooms, location, or size)');
      return;
    }
  
    setIsLoading(true);
    addMessage('user', `Looking for properties...`);
    addMessage('bot', '🔍 Searching for properties...');
  
    try {
      console.log('Searching with filters:', cleanedFilters); // Debug log
      
      const response = await propertyService.getProperties(cleanedFilters);
      
      console.log('Search response:', response); // Debug log
      
      if (response.success) {
        const properties = response.data || [];
        
        if (properties.length > 0) {
          setProperties(properties);
          
          // Generate AI response
          try {
            const aiResponse = await nlpService.generateResponse(
              `Found ${properties.length} properties`,
              { propertiesFound: properties.length }
            );
            addMessage('bot', aiResponse.data || `Found ${properties.length} properties matching your criteria!`);
          } catch (aiError) {
            console.error('AI response error:', aiError);
            addMessage('bot', `Found ${properties.length} properties matching your criteria!`);
          }
  
          // Save search to history
          try {
            await preferenceService.savePreferences(userId, {
              searchHistory: cleanedFilters,
              preferences: cleanedFilters
            });
          } catch (prefError) {
            console.error('Error saving preferences:', prefError);
            // Don't fail the search if preferences fail
          }
        } else {
          try {
            const aiResponse = await nlpService.generateResponse(
              'No properties found',
              { propertiesFound: 0 }
            );
            addMessage('bot', aiResponse.data || 'No properties found matching your criteria. Try adjusting your filters.');
          } catch (aiError) {
            addMessage('bot', 'No properties found matching your criteria. Try adjusting your filters.');
          }
          setProperties([]);
        }
      } else {
        addMessage('bot', response.error || 'No properties found. Try adjusting your filters.');
        setProperties([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // More specific error messages
      if (error.response?.status === 400) {
        addMessage('bot', `Invalid search parameters: ${error.response.data?.error || 'Please check your filters'}`);
      } else if (error.response?.status >= 500) {
        addMessage('bot', 'Server error. Please try again later.');
      } else {
        addMessage('bot', `Sorry, there was an error searching for properties: ${error.message || 'Unknown error'}`);
      }
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSaveProperty = async (propertyId) => {
    try {
      await preferenceService.saveProperty(userId, propertyId);
      await loadSavedProperties();
      addMessage('bot', '✅ Property saved to your favorites!');
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleRemoveProperty = async (propertyId) => {
    try {
      await preferenceService.removeProperty(userId, propertyId);
      await loadSavedProperties();
      addMessage('bot', 'Property removed from favorites.');
    } catch (error) {
      console.error('Error removing property:', error);
    }
  };

  const handleCompareProperty = (property) => {
    const propId = property._id || property.id;
    const isAlreadyComparing = comparedProperties.some(
      p => (p._id || p.id) === propId
    );

    if (isAlreadyComparing) {
      setComparedProperties(prev => 
        prev.filter(p => (p._id || p.id) !== propId)
      );
      addMessage('bot', 'Property removed from comparison.');
    } else {
      if (comparedProperties.length >= 4) {
        addMessage('bot', 'You can compare up to 4 properties at once. Remove one to add another.');
        return;
      }
      setComparedProperties(prev => [...prev, property]);
      addMessage('bot', 'Property added to comparison!');
    }
  };

  const handleRemoveFromComparison = (propertyId) => {
    if (propertyId === 'all') {
      setComparedProperties([]);
      addMessage('bot', 'Comparison cleared.');
    } else {
      setComparedProperties(prev => 
        prev.filter(p => (p._id || p.id) !== propertyId)
      );
    }
  };

  const addMessage = (type, text) => {
    const safe =
      typeof text === 'string'
        ? text
        : text == null
        ? ''
        : typeof text === 'object'
        ? JSON.stringify(text)
        : String(text);
    setMessages(prev => [...prev, { type, text: safe }]);
  };

// Add this function outside the component
const extractFiltersFallback = (message) => {
  const filters = {};
  const lowerMessage = message.toLowerCase();
  
  // Extract bedrooms
  const bedroomMatch = lowerMessage.match(/(\d+)\s*(?:bedroom|bedrooms|bed|beds)/);
  if (bedroomMatch) {
    filters.bedrooms = bedroomMatch[1];
  }
  
  // Extract bathrooms
  const bathroomMatch = lowerMessage.match(/(\d+)\s*(?:bathroom|bathrooms|bath)/);
  if (bathroomMatch) {
    filters.bathrooms = bathroomMatch[1];
  }
  
  // Extract budget
  const budgetPatterns = [
    /(?:under|below|max|up to|budget|price|cost).*?(\d+)(?:k|000|0000)/,
    /\$(\d+)(?:k|000|0000)?/,
    /(\d+)\s*(?:k|000|0000)\s*(?:budget|price|cost)/
  ];
  
  for (const pattern of budgetPatterns) {
    const match = lowerMessage.match(pattern);
    if (match) {
      let budget = parseInt(match[1]);
      if (lowerMessage.includes('k') && budget < 1000) {
        budget = budget * 1000;
      }
      filters.budget = budget.toString();
      break;
    }
  }
  
  // Extract location (after "in", "at", "near")
  const locationMatch = lowerMessage.match(/(?:in|at|near|around)\s+([a-z]+(?:\s+[a-z]+)?)/i);
  if (locationMatch) {
    filters.location = locationMatch[1].trim();
  }
  
  return filters;
};
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      addMessage('user', userMessage);
      setIsLoading(true);

    try {
      // Use NLP to understand user intent
      const nlpResponse = await nlpService.extractFilters(userMessage, messages);
      
      console.log('NLP Response:', nlpResponse); // Debug log
      
      if (nlpResponse.success && nlpResponse.data) {
        const extractedFilters = nlpResponse.data;
        const intent = extractedFilters.intent || 'general';

        // Check if we have any searchable filters
        const hasSearchFilters = Object.keys(extractedFilters).some(
          k => k !== 'intent' && extractedFilters[k] !== null && extractedFilters[k] !== ''
        );

        if (intent === 'search' || hasSearchFilters) {
          // Update filters with extracted data
          const newFilters = {
            ...filters,
            ...Object.fromEntries(
              Object.entries(extractedFilters).filter(([k, v]) => k !== 'intent' && v !== null && v !== '')
            )
          };
          setFilters(newFilters);
          
          console.log('Searching with filters:', newFilters); // Debug log
          
          // Perform search with extracted filters
          await handleSearch(newFilters);
        } else {
          // Generate AI response for general queries
          const aiResponse = await nlpService.generateResponse(userMessage);
          addMessage('bot', aiResponse.data || aiResponse || "I'm here to help! Try describing what you're looking for, or use the filters below.");
        }
      } else {
        // Fallback: Try simple keyword extraction
        console.log('NLP failed, trying fallback extraction');
        const fallbackFilters = extractFiltersFallback(userMessage);
        
        if (fallbackFilters.bedrooms || fallbackFilters.location || fallbackFilters.budget) {
          const newFilters = { ...filters, ...fallbackFilters };
          setFilters(newFilters);
          await handleSearch(newFilters);
        } else {
          addMessage('bot', "I'm here to help! Try describing what you're looking for, or use the filters below.");
        }
      }
    } catch (error) {
      console.error('NLP Error:', error);
      
      // Fallback: Try simple keyword extraction
      const fallbackFilters = extractFiltersFallback(userMessage);
      
      if (fallbackFilters.bedrooms || fallbackFilters.location || fallbackFilters.budget) {
        const newFilters = { ...filters, ...fallbackFilters };
        setFilters(newFilters);
        await handleSearch(newFilters);
      } else {
        addMessage('bot', "I'm here to help! Try describing what you're looking for, or use the filters below.");
      }
    } finally {
      setIsLoading(false);
      setInput('');
    }
  }
};

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>🏠 Real Estate Assistant - AgentMeera</h2>
        <button 
          className="toggle-filters-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Real-Time Search:</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search properties in real-time..."
              className="realtime-search-input"
            />
          </div>
          <div className="filter-group">
            <label>Budget ($):</label>
            <input
              type="number"
              value={filters.budget}
              onChange={(e) => setFilters({...filters, budget: e.target.value})}
              placeholder="Max budget"
            />
          </div>
          <div className="filter-group">
            <label>Location:</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              placeholder="City or area"
            />
          </div>
          <div className="filter-group">
            <label>Bedrooms:</label>
            <input
              type="number"
              value={filters.bedrooms}
              onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
              placeholder="Min bedrooms"
            />
          </div>
          <div className="filter-group">
            <label>Bathrooms:</label>
            <input
              type="number"
              value={filters.bathrooms}
              onChange={(e) => setFilters({...filters, bathrooms: e.target.value})}
              placeholder="Min bathrooms"
            />
          </div>
          <div className="filter-group">
            <label>Size (sqft):</label>
            <input
              type="number"
              value={filters.minSize}
              onChange={(e) => setFilters({...filters, minSize: e.target.value})}
              placeholder="Min size"
              style={{ width: '45%', marginRight: '5%' }}
            />
            <input
              type="number"
              value={filters.maxSize}
              onChange={(e) => setFilters({...filters, maxSize: e.target.value})}
              placeholder="Max size"
              style={{ width: '45%' }}
            />
          </div>
          <button 
            className="search-btn" 
            onClick={() => handleSearch()}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Searching...' : '🔍 Search Properties'}
          </button>
        </div>
      )}

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <div className="message-content">🤔 Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything! e.g., 'Find me a 3 bedroom house under $500k'"
          className="chat-input"
          disabled={isLoading}
        />
        <button type="submit" className="send-btn" disabled={isLoading}>
          {isLoading ? '⏳' : 'Send'}
        </button>
      </form>

      {comparedProperties.length > 0 && (
        <PropertyComparison 
          properties={comparedProperties}
          onRemove={handleRemoveFromComparison}
        />
      )}

      {properties.length > 0 && (
        <div className="properties-section">
          <h3>Search Results ({properties.length})</h3>
          <div className="properties-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onSave={() => handleSaveProperty(property._id)}
                onRemove={() => handleRemoveProperty(property._id)}
                onCompare={handleCompareProperty}
                isSaved={savedProperties.some(sp => sp._id === property._id || sp.toString() === property._id)}
                isComparing={comparedProperties.some(cp => (cp._id || cp.id) === (property._id || property.id))}
              />
            ))}
          </div>
        </div>
      )}

      {savedProperties.length > 0 && (
        <div className="saved-properties-section">
          <h3>Your Saved Properties ({savedProperties.length})</h3>
          <div className="properties-grid">
            {savedProperties.map((property) => (
              <PropertyCard
                key={property._id || property.id}
                property={property}
                onRemove={() => handleRemoveProperty(property._id)}
                onCompare={handleCompareProperty}
                isSaved={true}
                isComparing={comparedProperties.some(cp => (cp._id || cp.id) === (property._id || property.id))}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;