// require the database connection
const bookRepository = require("../repositories/bookRepository.js");

const bookValidator = require("../validators/bookValidators.js");

// validation package
const validator = require("validator");

// Get all books via the repository
// then return books
let getBooks = async () => {
  let books = await bookRepository.getBooks();
  return books;
};

// Get books by id via the repository
// Validate input
// then return book
let getBookById = async (bookId) => {
  let book;

  if (!bookValidator.validateId(bookId)) {
    console.log("getBooks service error: invalid id parameter");
    return "invalid parameter";
  }

  // get book
  book = await bookRepository.getBookById(bookId);

  return book;
};

// Get books in a category via the repository
// Validate the input
// then return books
let getBookByCatId = async (catId) => {
  let books;

  if (!bookValidator.validateId(catId)) {
    console.log("getBooks service error: invalid id parameter");
    return "invalid parameter";
  }

  books = await bookRepository.getBookByCatId(catId);

  return books;
};

// Insert a new book
// This function accepts book data as a paramter from the controller.
let createBook = async (book) => {
  // declare variables
  let newlyInsertedBook;

  // Calling the book validator
  let validatedBook = bookValidator.validateNewBook(book);

  // If validation returned a book object - save to database
  if (validatedBook != null) {
    newlyInsertedBook = await bookRepository.createBook(validatedBook);
  } else {
    // if book data fail to validate
    newlyInsertedBook = { error: "invalid book" };

    // debug info
    console.log("bookService.createBook(): form data validate failed");
  }

  // return the newly inserted book
  return newlyInsertedBook;
};

// book update service
let updateBook = async (book) => {
  // Declare variables
  let updatedBook;

  // call the book validator
  let validatedBook = bookValidator.validateUpdateBook(book);

  // If validation returned a book object - save to database
  if (validatedBook != null) {
    updatedBook = await bookRepository.updateBook(validatedBook);
  } else {
    // Book data failed validation
    updatedBook = { error: "Book update failed" };

    // debug info
    console.log("bookService.updateBook(): form data validate failed");
  }

  // return the newly inserted book
  return updatedBook;
};

let deleteBook = async (bookId) => {
  let deleteResult = false;

  if (bookValidator.validateId(bookId) === false) {
    console.log("deleteBooks service error: invalid id parameter");
    return false;
  }

  // delete book by id
  // result: true or false
  deleteResult = await bookRepository.deleteBook(bookId);

  // sucess
  return deleteResult;
};

// Module exports
// expose these functions
module.exports = {
  getBooks,
  getBookById,
  getBookByCatId,
  createBook,
  updateBook,
  deleteBook,
};
