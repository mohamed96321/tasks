const mongoose = require('mongoose');

// Initial Schema
const Schema = mongoose.Schema;

// Define Book Schema
const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    images: { type: Array, required: true },
    description: { type: String, default: '' },
    pulishedDate: {
      type: Date,
    },
  },
  { timeStamps: true }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
