
// Simple Express server to handle API requests
const express = require('express');
const cors = require('cors');
const testDbConnection = require('./test-db-connection');
const query = require('./query');

const app = express();
const PORT = process.env.PORT || 3005;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use('/test-db-connection', testDbConnection);
app.use('/query', query);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
