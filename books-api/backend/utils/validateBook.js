const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.bookValidation = [
  check("book_title")
    .isLength({ min: 5 })
    .withMessage("Title is too short.")
    .notEmpty()
    .withMessage("Title should not be empty."),
  check("author")
    .isLength({ min: 5 })
    .withMessage("Author is too short.")
    .notEmpty()
    .withMessage("Author should not be empty."),
  check("publish_year")
    .isNumeric()
    .withMessage("Year should be number.")
    .notEmpty()
    .withMessage("Year should not be empty.")
    .isLength({ min: 4 })
    .withMessage("Year is too short."),

  validatorMiddleware,
];
