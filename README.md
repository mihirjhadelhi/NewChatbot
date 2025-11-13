# 🏠 Real Estate Chatbot

An AI-assisted real estate assistant built with React.js, Node.js, and MongoDB that helps users find their dream properties through natural language queries or advanced filters.

## ✨ Features

- **🤖 NLP-Driven Search** - Extract filters from natural language (e.g., "3 bedroom in Austin under $500k")
- **⚡ Real-Time Search** - Filter properties dynamically as you type with debouncing
- **⭐ Favorites System** - Save properties to favorites, stored per user in MongoDB
- **📊 Property Comparison** - Compare up to 4 properties side-by-side
- **💬 Intelligent Chatbot** - AI-powered responses using OpenAI (optional)
- **🔍 Advanced Filtering** - Filter by budget, location, bedrooms, bathrooms, size, and amenities
- **📱 Responsive Design** - Modern, user-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM

### Database
- **MongoDB** - NoSQL database (Local or Atlas)

### AI/ML
- **OpenAI API** - Natural language processing (optional)


## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (LTS version recommended) - [Download](https://nodejs.org/)
- **MongoDB** (Local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **OpenAI API Key** (Optional, for NLP features) - [Get API Key](https://platform.openai.com/api-keys)

## 🚀 Setup Instructions

### Step 1: Install Dependencies

#### Backend Dependencies
cd server
npm install
#### Frontend Dependencies
cd ../client
npm install 

### Step 2: Configure environment variable 

Create a `.env` file in the `server` directory:

## Environment
NODE_ENV=development

## Server Configuration
PORT=5000
HOST=0.0.0.0

## Debug Flags
DEBUG=true
VERBOSE=false

## MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/propertydb

## For MongoDB Atlas (Cloud):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/propertydb

## OpenAI API Key (Optional, for NLP features)
OPENAI_API_KEY=sk-your-openai-api-key-here

## Feature Flags
ENABLE_NLP=true
ENABLE_CORS=true
> **Note:** Never commit the `.env` file to version control. Add it to `.gitignore`.

### Step 3: Seed Database

Import sample property data into MongoDB:
ash
cd server
npm run importThis command will:
- Read all JSON files from the `data/` folder
- Merge properties by matching `id` fields
- Insert merged data into the `properties` collection in MongoDB

### Step 4: Start the Application

#### Start Backend Server

cd server
npm startThe server will start on `http://localhost:5000`

#### Start Frontend Development Server

Open a new terminal:

cd client
npm run devThe frontend will be available at `http://localhost:5173` (default Vite port)

## 💻 Usage

### Using the Chatbot

1. **Natural Language Queries**
   - Type queries like: "Find me a 3 bedroom condo under $600k in Miami"
   - The AI will extract filters and search automatically

2. **Filter Panel**
   - Click "Show Filters" to access the filter panel
   - Set budget, location, bedrooms, bathrooms, size range
   - Click "Search Properties" to apply filters

3. **Real-Time Search**
   - Use the "Real-Time Search" input field
   - Properties filter automatically as you type (with 500ms debounce)

4. **Save Favorites**
   - Click "⭐ Save Property" on any property card
   - View saved properties in the "Your Saved Properties" section

5. **Compare Properties**
   - Click "📊 Compare" on up to 4 properties
   - View side-by-side comparison table

### Notes

- A temporary `userId` is generated per browser session
- Favorites and comparisons are linked to this `userId`
- Data persists in MongoDB until cleared

## 🔌 API Documentation

### Base URL

Frontend Dependencies
cd ../client

npm installperties

**GET `/api/properties`**
- Get all properties with optional filters
- **Query Parameters:**
  - `budget` (number) - Maximum price
  - `location` (string) - City or area name
  - `bedrooms` (number) - Minimum bedrooms
  - `bathrooms` (number) - Minimum bathrooms
  - `minSize` (number) - Minimum square footage
  - `maxSize` (number) - Maximum square footage
  - `amenities` (string) - Comma-separated list
- **Example:**
  
  Step 2: Configure Environment Variables
Create a .env file in the server directory:
## Environment
NODE_ENV=development

## Server Configuration
PORT=5000
HOST=0.0.0.0

## Debug Flags
DEBUG=true
VERBOSE=false

## MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/propertydb

## For MongoDB Atlas (Cloud):
## MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/propertydb

## OpenAI API Key (Optional, for NLP features)
OPENAI_API_KEY=sk-your-openai-api-key-here

## Feature Flags
ENABLE_NLP=true
ENABLE_CORS=true

Step 3: Seed Database
Import sample property data into MongoDB:

cd server
npm run import**GET `/api/preferences/:userId`**
- Get user preferences and saved properties
- **Example:**

This command will:
Read all JSON files from the data/ folder
Merge properties by matching id fields
Insert merged data into the properties collection in MongoDB

Step 4: Start the Application
Start Backend Server

cd server
npm startrences`**
- Create or update user preferences
- **Body:**son
  {
    "userId": "user_1234567890",
    "savedProperties": ["propertyId1", "propertyId2"],
    "preferences": {
      "minBudget": 200000,
      "maxBudget": 500000
    },
    "searchHistory": [{
      "bedrooms": 3,
      "location": "Austin"
    }]
  }
**POST `/api/preferences/:userId/save`**
- Save a property to favorites
- **Body:**
  {
    "propertyId": "507f1f77bcf86cd799439011"
  }**DELETE `/api/preferences/:userId/save/:propertyId`**
- Remove a property from favorites

#### NLP (Optional)

**POST `/api/nlp/extract`**
- Extract filters from natural language
- **Body:**on
  {
    "message": "I need a 3 bedroom house under $500k",
    "conversationHistory": []
  }**POST `/api/nlp/chat`**
- Generate AI chatbot response
- **Body:**
  {
    "message": "Hello",
    "context": {
      "propertiesFound": 5
    }
  }## 📊 Data Models

### Property Schema

{
  id: Number,              // Unique identifier
  
  bedrooms: Number,        // Number of bedrooms
  
  bathrooms: Number,       // Number of bathrooms
  
  size_sqft: Number,       // Square footage
  
  amenities: [String],     // Array of amenities
  
  image_url: String,       // Property image URL
  
  location: String,        // Location (default: 'Unknown')
  
  price: Number,           // Price (default: 0)
  
  createdAt: Date,         // Auto-generated
  
  updatedAt: Date          // Auto-generated

}### UserPreference Schema

vascript
{
  userId: String,                    // Unique user identifier

  savedProperties: [ObjectId],        // Array of Property references
  
  preferences: {
    minBudget: Number,
  
    maxBudget: Number,
    
    preferredLocations: [String],
    
    minBedrooms: Number,
    
    minBathrooms: Number,
    
    requiredAmenities: [String]
  },
  searchHistory: [{
    budget: Number,
    location: String,
    bedrooms: Number,
    bathrooms: Number,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}## 🛠️ Available Scripts

### Backend Scripts (`server/package.json`)
sh
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run import     # Import data from data/ folder to MongoDB### Frontend Scripts (`client/package.json`)
sh
npm run dev        # Start Vite development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint## 🐛 Troubleshooting

### Common Issues

#### "Objects are not valid as a React child"
- **Solution:** Ensure you're accessing `aiResponse.data` (string) instead of the whole response object
- Check `ChatBot.jsx` line 336 for proper response handling

#### "MODULE_NOT_FOUND: importData.js"
- **Solution:** Ensure `server/scripts/importData.js` exists
- Run `npm run import` from the `server` directory

#### MongoDB Connection Error
- **Solution:**
  1. Verify MongoDB is running locally, or
  2. Check `MONGODB_URI` in `server/.env`
  3. For Atlas: Whitelist your IP address and verify connection string

#### CORS Issues
- **Solution:** Backend has CORS enabled by default
- Ensure frontend API URL in `client/src/utils/constants.js` matches backend URL

#### OpenAI API Errors
- **Solution:**
  1. Verify `OPENAI_API_KEY` in `server/.env`
  2. Check API key is valid and has credits
  3. NLP features will fallback to simple keyword extraction if API fails

#### Port Already in Use
- **Solution:** Change `PORT` in `server/.env` or kill the process using the port

## 🔒 Security Considerations

- ✅ Never commit `.env` files to version control
- ✅ Use environment variables for sensitive data
- ✅ Implement input validation (already included)
- ✅ Consider rate limiting for production
- ✅ Rotate API keys regularly
- ✅ Use HTTPS in production
- ✅ Implement authentication for production use

## 🌐 Network Access

To make the server accessible from other devices on your network:

1. Set `HOST=0.0.0.0` in `server/.env`
2. Find your IP address:
   - **Windows:** `ipconfig`
   - **Mac/Linux:** `ifconfig` or `ip addr show`
3. Access from other devices: `http://<your-ip>:5000`
4. Update frontend API URL if needed

## 🗺️ Roadmap

- [ ] User authentication and persistent profiles
- [ ] Pagination and infinite scroll for properties
- [ ] Map view with geospatial queries
- [ ] Server-side caching for frequent searches
- [ ] Email notifications for saved properties
- [ ] Advanced analytics and search insights
- [ ] Multi-language support
- [ ] Property image upload functionality

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using React, Node.js, and MongoDB**

The server will start on http://localhost:5000
Start Frontend Development Server
Open a new terminal:

cd client
npm run dev
The frontend will be available at http://localhost:5173 (default Vite port) 

💻 Usage
Using the Chatbot

Natural Language Queries
Type queries like: "Find me a 3 bedroom in Miami"
The AI will extract filters and search automatically

Filter Panel
Click "Show Filters" to access the filter panel
Set budget, location, bedrooms, bathrooms, size range
Click "Search Properties" to apply filters

Real-Time Search
Use the "Real-Time Search" input field
Properties filter automatically as you type (with 500ms debounce)
Save Favorites
Click "⭐ Save Property" on any property card

View saved properties in the "Your Saved Properties" section
Compare Properties
Click "📊 Compare" on up to 4 properties
View side-by-side comparison table

Notes
A temporary userId is generated per browser session
Favorites and comparisons are linked to this userId
Data persists in MongoDB until cleared

🔌 API Documentation
Base URL
http://localhost:5000/api





