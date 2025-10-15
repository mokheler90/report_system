const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'luct_system',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'emmanuel^',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection function
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL database connected successfully');
    
    // Test query to verify connection
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL Version:', result.rows[0].version);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('💡 Make sure your PostgreSQL environment variables are set correctly in Render');
    console.log('💡 Required variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
    process.exit(1);
  }
};

const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const monitoringRoutes = require('./routes/monitoringRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const classRoutes = require('./routes/classRoutes');
const courseRoutes = require('./routes/courseRoutes');
const streamRoutes = require('./routes/streamRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const excelRoutes = require('./routes/excelRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Make the database pool available to all routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Enhanced health check route with database status
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const client = await pool.connect();
    const dbResult = await client.query('SELECT 1 as test');
    client.release();

    res.status(200).json({
      success: true,
      message: 'LUCT Report System API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: {
        status: 'Connected',
        type: 'PostgreSQL',
        test: dbResult.rows[0].test
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'LUCT Report System API is running but database is disconnected',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: {
        status: 'Disconnected',
        error: error.message
      },
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/excel', excelRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler (should be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server gracefully...');
  await pool.end();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 LUCT Report System API is ready`);
  console.log(`🗄️  Using PostgreSQL database`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});