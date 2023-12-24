const { validationResult } = require("express-validator");

// @desc  Finds the validation errors in this request and wraps them in an object with handy functions
const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      res
        .status(422)
        .json({ message: "Validation failed", errors: errors.array() }),
    );
  }
  next();
};

module.exports = validatorMiddleware;
