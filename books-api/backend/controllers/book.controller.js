const fs = require("fs");
const Book = require("../models/Book");
const ApiError = require("../utils/apiError.js");

exports.getBooks = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const books = await Book.find().skip(skip).limit(limit);
    res.json(books);
  } catch (error) {
    next(new ApiError("We can't get Books.", 500));
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const { book_title, author, publish_year, description } = req.body;
    const book = new Book({
      book_title,
      book_image: req.file.path,
      author,
      publish_year,
      description,
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    next(new ApiError("We can't create Book.", 500));
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const { book_title, author, publish_year, description } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
    if (req.file) {
      fs.unlink(book.book_image, () => {
        console.log("Image path is updated.");
      });
      book.book_image = req.file.path;
    }

    book.book_title = book_title;
    book.author = author;
    book.publish_year = publish_year;
    book.description = description;

    await book.save();
    res.json(book);
  } catch (error) {
    next(new ApiError("We can't update Book.", 500));
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return next(res.status(404).json({ message: "Book not found." }));
    }
    fs.unlink(book.book_image, () => {
      console.log("Image path is deleted.");
    });
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully." });
  } catch (error) {
    next(new ApiError("We can't delete Book.", 500));
  }
};

exports.searchBook = async (req, res, next) => {
  try {
    const { book_title, author, publish_year } = req.query;
    const query = {};
    if (book_title) query.book_title = book_title;
    if (author) query.author = author;
    if (publish_year) query.publish_year = publish_year;
    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    next(new ApiError("We can't search for specific Books.", 500));
  }
};
