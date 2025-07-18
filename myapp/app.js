// Environment variables
require('dotenv').config();

// Modules
const express = require('express'); 
const connectDB = require('./config/db');  // Database connection module       
const bookRoutes = require('./routes/bookRoutes'); //Book routes
const userRoutes = require('./routes/userRoutes'); // User routes 
const reviewRoutes = require('./routes/reviewRoutes'); // Review routes

// Express App Initialization
const app = express();
const PORT = process.env.PORT || 8000; 

// DB Connection
connectDB(); // Call the function to connect to MongoDB

//Middleware to parse JSON bodies
// This enables your Express app to understand JSON data sent in request bodies.
app.use(express.json());

//static files middleware
app.use(express.static('public')); 

//Root Route
app.get('/', (req, res) => {
  res.redirect('/index.html');
});


// --- Book Routes ---
app.use('/api/books', bookRoutes);

// --- User Routes ---
app.use('/api/users', userRoutes);

// --- Review Routes ---
app.use('/api/books/:bookId/reviews', reviewRoutes); // Note: The bookId is dynamic and will be handled in the reviewRoutes file



// --- Error Handling Middleware ---
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware
});

// Generic error handling middleware
app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});