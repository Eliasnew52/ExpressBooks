// Environment variables
require('dotenv').config();

// Modules
const express = require('express');
const connectDB = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const { protect } = require('./middleware/auth'); // Import your authentication middleware
const cookieParser = require('cookie-parser'); // Import cookie-parser

// Express App Initialization
const app = express();
const PORT = process.env.PORT || 8000;

// DB Connection
connectDB();

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser()); // To parse cookies (if HTTP-only cookies for JWT)

// Serve static files from the 'public' directory
// This line is crucial! It makes files inside 'public' accessible directly via URL.
app.use(express.static('public'));

// Root Route - serves the login page initially
// When a user visits http://localhost:8000/, they will be redirected to login.html
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// --- Public Routes ---
// User registration and login routes are public, so no 'protect' middleware here
app.use('/api/users', userRoutes); // This handles /api/users/register and /api/users/login

// --- Protected Routes ---
// Apply the 'protect' middleware to routes that require authentication
// Any request to /api/books or /api/books/:bookId/reviews will first go through 'protect'
app.use('/api/books', protect, bookRoutes);
app.use('/api/books/:bookId/reviews', protect, reviewRoutes);

// Protect the index.html file itself
// If someone tries to go directly to /index.html without a valid token,
// the 'protect' middleware will intercept and send a 401.
// Your frontend JS in index.html will then handle the redirect to login.html.
app.get('/index.html', protect, (req, res) => {
    // If 'protect' middleware passes, it means the user is authenticated.
    // We then explicitly send the index.html file.
    // Note: express.static('public') already handles serving /index.html if it's in 'public'.
    // This specific route is mainly to apply the 'protect' middleware to it.
    res.sendFile(__dirname + '/public/index.html');
});


// --- Error Handling Middleware ---
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
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