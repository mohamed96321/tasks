const express = require("express");
const { bookValidation } = require("../utils/validateBook");
const {
  getBooks,
  createBook,
  deleteBook,
  searchBook,
  updateBook,
} = require("../controllers/book.controller");

const fileUpload = require("../middlewares/uploadImage");

const router = express.Router();

router
  .route("/")
  .get(getBooks)
  .post(fileUpload.single("book_image"), bookValidation, createBook);
router
  .route("/:id")
  .delete(deleteBook)
  .put(fileUpload.single("book_image"), bookValidation, updateBook);
router.route("/search").get(searchBook);

module.exports = router;
