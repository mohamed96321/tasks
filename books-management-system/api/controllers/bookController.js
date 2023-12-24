const fs = require('fs');
// Async http requests between api and client
const asyncHandler = require('express-async-handler');
// Book Schema
const Book = require('../models/Book');
// Generate randam value
const { v4: uuidv4 } = require('uuid');
// Sharp
const sharp = require('sharp');
// Import upload images middleware
const { uploadMixOfImages } = require('../middlewares/uploadImagesMiddleware');
const ApiError = require('../utils/apiError');

exports.uploadBookImages = uploadMixOfImages([
  {
    name: 'images',
    maxCount: 5,
  },
]);

exports.getBooks = asyncHandler(async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const books = await Book.paginate(query, options);

    res.status(200).json({
      status: 'success',
      data: books,
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
});

exports.createNewBook = asyncHandler(async (req, res, next) => {
  try {
    const { title, author, description, publishedDate } = req.body;
    const images = [];

    for (let i = 0; i < req.files.images.length; i++) {
      const image = req.files.images[i];
      const imageFileName = `book-${uuidv4()}-${Date.now()}.jpeg`;

      // Resize and save the image using sharp
      await sharp(image.buffer)
        .resize(800, 800)
        .jpeg({ quality: 90 })
        .toFile(`./uploads/${imageFileName}`);

      images.push(imageFileName);
    }

    const newBook = await Book.create({
      title,
      author,
      images,
      description,
      publishedDate,
    });

    res.status(201).json({
      status: 'success',
      data: newBook,
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      throw new ApiError('Book not found', 404);
    }

    // Delete the related images
    for (const image of book.images) {
      const imagePath = `./uploads/${image}`;
      fs.unlinkSync(imagePath);
    }

    // Delete the book
    await book.remove();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
});
