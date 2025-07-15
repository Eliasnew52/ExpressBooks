const express = require('express');
const router = express.Router(); // Use Express's Router
const Book = require('../models/book'); 

// @desc    Get all books
// @route   GET /api/books
// @access  Public
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    res.status(500).json({ message: 'Server Error' });
  }
});


// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    // More specific error handling for invalid ObjectId format
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Book ID format' });
    }
    console.error(error); // Log the actual error
    res.status(500).json({ message: 'Server Error' });
  }
});


// @desc    Create a new book
// @route   POST /api/books
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, thumbnail } = req.body;

    if (!title || !author || !isbn || !thumbnail) {
      return res.status(400).json({ message: 'Please include all required fields: title, author, isbn, thumbnail' });
    }

    // Create a new book document using the Mongoose Book model
    const newBook = await Book.create({
      title,
      author,
      isbn, 
      thumbnail
    });

    // Send back the newly created book with a 201 Created status
    res.status(201).json(newBook);

  } catch (error) {
    // Handle validation errors from Mongoose (e.g., if 'required' fields are still missing)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router; // Export the router