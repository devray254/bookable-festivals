
// Node.js API for executing database queries
const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// Database connection parameters
const dbConfig = {
  host: '92.113.28.141', // Online database server hostname
  user: 'u944702148_baraportal',  // Online database username
  password: 'K@m1kaze.12.12!',    // Online database password
  database: 'u944702148_maabaraonline'
};

// POST endpoint to execute SQL queries
router.post('/', async (req, res) => {
  try {
    const { sql, params } = req.body;
    
    if (!sql) {
      return res.status(400).json({
        success: false,
        message: 'SQL query is required'
      });
    }
    
    console.log('Executing query:', sql);
    console.log('With params:', params || []);
    
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    
    // Execute query
    const [result] = await connection.execute(sql, params || []);
    
    // Close connection
    await connection.end();
    
    // Return success response with results
    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Database query error:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute query',
      error: error.code,
      sqlState: error.sqlState
    });
  }
});

module.exports = router;
