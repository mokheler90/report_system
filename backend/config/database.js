const { Pool } = require('pg');
require('dotenv').config();

// For Render PostgreSQL, we need to use the connection string with specific SSL settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://luct_system_gk5n_user:UDM93To2wqVQ1oiYmDy5hVnlvpeplR1v@dpg-d3m2md63jp1c73fl4fmg-a.oregon-postgres.render.com/luct_system_gk5n',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout
});

const connectDB = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    
    // Test the connection
    const result = await client.query('SELECT version()');
    console.log('🗄️ PostgreSQL version:', result.rows[0].version);
    
    // Test with current time
    const timeResult = await client.query('SELECT NOW()');
    console.log('📅 Database time:', timeResult.rows[0].now);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('🔧 Error details:', error);
    
    if (client) {
      client.release();
    }
    return false;
  }
};

// Event listeners
pool.on('connect', () => {
  console.log('🔌 Client connected to pool');
});

pool.on('error', (err) => {
  console.error('❌ Pool error:', err);
});

module.exports = { pool, connectDB };