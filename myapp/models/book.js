const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  thumbnail: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema); // Export the model directly