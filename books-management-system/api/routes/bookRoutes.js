const express = require('express');

// Import books functions from controllers
const {
  getBooks,
  createNewBook,
  deleteBook,
  uploadBookImages
} = require('../controllers/bookController');

// Validator
const { createNewBookValidator } = require('../utils/validator');

// Initial Router
const router = express.Router();

router
  .route('/')
  .get(getBooks)
  .post(
    uploadBookImages,
    createNewBookValidator, 
    createNewBook
  );
router.delete('/:id', deleteBook);

module.exports = router;
