const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  book_title: { type: String, required: true },
  book_image: { type: String, required: true },
  author: { type: String, required: true },
  publish_year: { type: Number, required: true },
  description: { type: String, default: "" },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
