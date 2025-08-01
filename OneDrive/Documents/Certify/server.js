require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const certRoutes = require('./routes/certRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/certs', certRoutes);
app.use('/api/uploads', uploadRoutes);

// Load configuration first to avoid potential issues
const config = require('./config');
const { port = 3000, mongoURI } = config;

// Use the mongoURI from config if MONGO_URI is not set in environment
const dbURI = process.env.MONGO_URI || mongoURI;

console.log('Connecting to MongoDB with URI:', dbURI ? 'URI exists' : 'No URI found');

mongoose.connect(dbURI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
