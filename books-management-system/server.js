const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
// const cors = require('cors');
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");

require("dotenv").config();

const app = express();

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/booksDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4() + "-" + file.originalname;
    cb(null, uniqueFilename);
  },
});

const filter = function (req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("unsupported files"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2mb
  },
  fileFilter: filter,
});

// Book schema
const bookSchema = new mongoose.Schema({
  book_title: { type: String, required: true },
  book_image: { type: String, required: true },
  author: { type: String, required: true },
  publish_year: { type: Number, required: true },
  description: { type: String, default: "" },
});
const Book = mongoose.model("Book", bookSchema);

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(422).json({ errors: errors.array() });
};

// Parse body params and attach them to req.body
app.use(bodyParser.json({ limit: "20kb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Show Requests Http Status
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.use(cors());
// Cors Headers => require for cross origin and cross server communcation
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH, TRACE, CONNECT",
  );
  next();
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlinkSync(req.file.filename, (err) => {
      console.log("You must fill out all inputs!");
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  console.status(error.code || 500);
  res.json({ message: error.message || "Something went wrong!" });
});

const VALIDATE_VALUES = [
  body("book_title")
    .isLength({ min: 5 })
    .withMessage("Title is too short.")
    .notEmpty()
    .withMessage("Title should not be empty."),
  body("author")
    .isLength({ min: 5 })
    .withMessage("Author is too short.")
    .notEmpty()
    .withMessage("Author should not be empty."),
  body("publish_year")
    .isNumeric()
    .withMessage("Year should be number.")
    .notEmpty()
    .withMessage("Year should not be empty.")
    .isLength({ min: 4 })
    .withMessage("Year is too short."),
];

// Get all books with pagination
app.get("/books", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const books = await Book.find().skip(skip).limit(limit);
    res.json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new book with conditional multer for image upload
app.post(
  "/books",
  upload.single("book_image"),
  VALIDATE_VALUES,
  validate,
  async (req, res) => {
    try {
      const { book_title, author, publish_year, description } = req.body;
      const book = new Book({
        book_title,
        book_image: req.file.filename,
        author,
        publish_year,
        description,
      });
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Update a specific book by ID with validation and multer for image replacement
app.put(
  "/books/:id",
  upload.single("book_image"),
  VALIDATE_VALUES,
  validate,
  async (req, res) => {
    try {
      const { book_title, author, publish_year, description } = req.body;
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Delete previous book image
      if (req.file) {
        fs.unlinkSync("uploads/" + book.book_image);
        book.book_image = req.file.filename;
      }

      book.book_title = book_title;
      book.author = author;
      book.publish_year = publish_year;
      book.description = description;

      await book.save();
      res.json(book);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Delete a book
app.delete("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    // Delete image from uploads folder
    fs.unlinkSync("uploads/" + book.book_image);
    // Delete book from database
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search for books
app.get("/books/search", async (req, res) => {
  try {
    const { title_book, author, publish_year } = req.query;
    const query = {};
    if (title_book) query.title_book = title_book;
    if (author) query.author = author;
    if (publish_year) query.publish_year = publish_year;
    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
