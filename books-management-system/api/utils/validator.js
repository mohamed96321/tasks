const { check } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');

exports.createNewBookValidator = [
  check('title'),
  check('author'),
  check('images'),
  validatorMiddleware,
];
