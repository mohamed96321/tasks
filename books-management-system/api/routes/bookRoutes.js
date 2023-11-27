const express = require('express');

// Import books functions from controllers
const {
  getBooks,
  createNewBook,
  deleteBook,
} = require('../controllers/bookController');

// Validator
const { createNewBookValidator } = require('../utils/validator');

// Initial Router
const router = express.Router();

router.get('/', getBooks);

router.post('/', createNewBookValidator, createNewBook);

router.delete('/:id', deleteBook);

module.exports = router;
