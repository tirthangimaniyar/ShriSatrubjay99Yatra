const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { seedDefaultData } = require('./services/dataService');

// Route imports
const authRoutes = require('./routes/authRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const settingRoutes = require('./routes/settingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const rawFrontendUrls = process.env.FRONTEND_URL || process.env.CLIENT_URL || '';
const configuredOrigins = rawFrontendUrls
  ? rawFrontendUrls.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman, health checks)
    if (!origin) {
      return callback(null, true);
    }
    // Allow any onrender.com origin, localhost, or configured origins
    if (
      origin.endsWith('.onrender.com') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      configuredOrigins.includes('*') ||
      configuredOrigins.includes(origin)
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, '..', 'client', 'public', 'images')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/settings', settingRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  const { isConnectedToMongo, getLastMongoError, isTtlIndexVerified, getMongoConfig } = require('./config/db');
  const mongoConfig = getMongoConfig ? getMongoConfig() : { hasUri: Boolean(process.env.MONGODB_URI), uri: process.env.MONGODB_URI || '', host: 'unknown' };

  const lastErr = getLastMongoError() ? getLastMongoError().message : null;
  let atlasDiagnosis = null;
  if (!mongoConfig.hasUri) {
    atlasDiagnosis = 'No MongoDB URI found in environment variables. Add MONGODB_URI in Render Dashboard (Web Service -> Environment).';
  } else if (lastErr && lastErr.includes('SSL alert number 80')) {
    atlasDiagnosis = 'MongoDB Atlas rejected the connection because the connecting IP is not whitelisted. In MongoDB Atlas (cloud.mongodb.com) -> Security -> Network Access, add IP "0.0.0.0/0" (Allow Access from Anywhere). Render containers have dynamic IPs, so 0.0.0.0/0 is required.';
  } else if (lastErr && lastErr.includes('EBADNAME')) {
    atlasDiagnosis = 'Cluster hostname in connection string could not be resolved by DNS.';
  } else if (lastErr && lastErr.includes('bad auth')) {
    atlasDiagnosis = 'Database username or password is incorrect. Verify user credentials in MongoDB Atlas Database Access.';
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Shri Shatrunjay Giriraj 99 Yatra API',
    version: '1.0.0',
    database: {
      connected: isConnectedToMongo(),
      hasMongoUri: mongoConfig.hasUri,
      envKeyFound: mongoConfig.foundKey,
      uriType: mongoConfig.uri.startsWith('mongodb+srv') ? 'mongodb+srv' : (mongoConfig.uri ? 'mongodb' : 'none'),
      uriHost: mongoConfig.host,
      databaseName: mongoConfig.dbName,
      ttlIndexVerified: isTtlIndexVerified(),
      lastError: lastErr,
      diagnosis: atlasDiagnosis
    }
  });
});

// Serve Frontend Production Build if present
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/images') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    await seedDefaultData();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  Shri Shatrunjay Palitana 99 Yatra Server Running     `);
      console.log(`  Port: ${PORT}                                       `);
      console.log(`  Website URL:  http://localhost:${PORT}             `);
      console.log(`  Admin Portal: http://localhost:${PORT}/admin        `);
      console.log(`  Health Check: http://localhost:${PORT}/api/health    `);
      console.log(`  Default Admin: ${process.env.ADMIN_EMAIL || 'admin@palitana99yatra.org'}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
