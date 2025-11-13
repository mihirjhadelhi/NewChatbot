const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const propertyRoutes = require('./routes/propertyRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');
const nlpRoutes = require('./routes/nlpRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/nlp', nlpRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('OpenAI API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes (hidden)' : 'NO - Missing!');
});