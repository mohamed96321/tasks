const { check } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');

exports.createNewBookValidator = [
  check('title')
    .isEmpty()
    .withMessage('Title not should be empty.')
    .isLength({ min: 6 })
    .withMessage('Title is too short.'),
  check('author')
    .isEmpty()
    .withMessage('Author not should be empty.')
    .isLength({ min: 6 })
    .withMessage('Author is too short.'),
  check('images')
    .isEmpty()
    .withMessage('Image not should be empty.')
    .isArray()
    .withMessage('Images must be an array of string.'),
  check('description').optional(),
  validatorMiddleware,
];
