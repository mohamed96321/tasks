const path = require('path');

const express = require('express');
const morgan = require('morgan');
const connectToDatabase = require('./config/db');

// Config environment (.env).
require('dotenv').config({ path: '.env' });

// Routes
const bookRoutes = require('./routes/bookRoutes');

// Import GlobalError and ApiError
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/middlewareError');

// Connect MongoDatabase
connectToDatabase();

// Initail serevr
const app = express();

// Cors Headers => Required for cross-origin / cross-server communication
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, PUT, OPTIONS'
  );
  next();
});

// Middleware => express to parsing data.
app.use(express.json({ limit: '20kb' }));

// Uploads folder to save images
app.use(express.static(path.join(__dirname, 'uploads')));

// Middleware => Morgan Shown Request Status
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Middleware => Routes
app.use('/api/books', bookRoutes);

// Middleware => ApiError & Global Error: Handling middleware for express
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(globalError)

// Initial Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Handle rejection outside express
process.on('unHandledRejection', (err) => {
  console.log(`unHandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log('Serevr is shutting down........');
    process.exit(1);
  });
});
