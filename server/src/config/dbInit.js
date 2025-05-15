const fs = require('fs');
const path = require('path');
const dbConnection = require('./db');

async function initializeDatabase() {
  try {
    console.log('Checking database schema...');
    
    // Check if roles table exists
    const tableCheck = await dbConnection.query(
      "SELECT to_regclass('public.roles') as table_exists"
    );
    
    if (tableCheck.rows[0].table_exists) {
      console.log('Database schema already initialized.');
      return;
    }
    
    console.log('Initializing database schema...');
    
    // Read schema.sql file
    const schemaPath = path.join(__dirname, '../../../docs/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema SQL
    await dbConnection.query(schemaSql);
    
    console.log('Database schema initialized successfully!');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  }
}

module.exports = { initializeDatabase };