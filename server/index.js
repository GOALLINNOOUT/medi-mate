const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const admin = require('firebase-admin');

dotenv.config();

// Initialize Firebase Admin SDK
try {
  const serviceAccount = require(process.env.FIREBASE_CREDENTIALS || './firebase-credentials.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized');
} catch (err) {
  console.warn('Firebase Admin SDK initialization failed:', err.message);
  // Continue server startup even if Firebase fails - we can handle notification failures gracefully
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());

// Cookie parser for refresh tokens
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Route wiring
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const medsRouter = require('./routes/medications');

app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/medications', medsRouter);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Connect to MongoDB if MONGO_URI is provided, but don't crash if missing
async function start() {
  let dbConnected = false;
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      dbConnected = true;
      console.log('MongoDB connected');
    } catch (err) {
      console.warn('MongoDB connection failed:', err.message);
    }
  } else {
    console.warn('MONGO_URI not set — skipping DB connection (OK for local dev).');
  }

  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  // graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    server.close(() => process.exit(0));
  });
}

start();

module.exports = app;
