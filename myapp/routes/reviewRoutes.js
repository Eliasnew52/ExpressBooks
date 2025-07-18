const express = require('express');
const router = express.Router(); // Use Express's Router
const Review = require('../models/review'); 
const Book = require('../models/book');

// @desc   Get all reviews for a book
// @route  GET /api/books/:bookId/reviews
// @access Public
router.get('/api/books/:bookId/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ bookId: req.params.bookId }).populate('reviewer', 'username');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc   Create a new review for a book
// @route  POST /api/books/:bookId/reviews
// @access Public
router.post('/api/books/:bookId/reviews', async (req, res) => {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        return res.status(400).json({ message: 'Rating and comment are required' });
    }

    try {
        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const newReview = new Review({
            bookId: book._id,
            reviewer: req.user._id, // Assuming req.user is set by authentication middleware
            rating,
            comment
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;