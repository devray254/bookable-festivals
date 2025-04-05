
// Node.js API for testing database connection
const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// Database connection parameters - same as in PHP version
const dbConfig = {
  host: '92.113.28.141', // Online database server hostname
  user: 'u944702148_baraportal',  // Online database username
  password: 'K@m1kaze.12.12!',    // Online database password
  database: 'u944702148_maabaraonline'
};

// GET endpoint to test database connection
router.get('/', async (req, res) => {
  try {
    console.log('Testing database connection to MySQL...');
    
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    
    // Get server information
    const [serverInfoRows] = await connection.execute('SELECT VERSION() as version');
    const serverInfo = serverInfoRows[0]?.version || 'Unknown';
    
    // List tables to further validate connection
    const [tablesResult] = await connection.execute('SHOW TABLES');
    const tables = tablesResult.map(row => Object.values(row)[0]);
    
    // Close connection
    await connection.end();
    
    // Return success response with details
    res.json({
      success: true,
      message: 'Successfully connected to MySQL database',
      server_info: serverInfo,
      tables: tables,
      details: {
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to connect to database',
      error: error.code,
      sqlState: error.sqlState,
      details: {
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database
      }
    });
  }
});

module.exports = router;
