// Input validation package
const validator = require("validator");

// models
const Book = require("../models/book.js");

// Validate id field
let validateId = (id) => {
  // check if number is numeric
  if (
    validator.isNumeric(id + "", { no_symbols: true, allow_negatives: false })
  ) {
    return true;
  } else {
    console.log("Book validator: invalid id parameter");
  }
  // validation failed
  return false;
};

// Validate the body data, sent by the client, for a new book
// formBook represents the data filled in a form
// It needs to be validated before using in the application
let validateNewBook = (formBook) => {
  // Declare constants and variables
  let validatedBook;

  // debug to console - if no data
  if (formBook === null) {
    console.log("validateNewBook(): Parameter is null");
  }

  // Validating form data for new book fields
  if (
    validator.isNumeric(formBook.CategoryId + "", {
      no_symbols: true,
      allow_negatives: false,
    }) &&
    !validator.isEmpty(formBook.BookName) &&
    !validator.isEmpty(formBook.BookDescription) &&
    validator.isNumeric(formBook.BookStock + "", {
      no_symbols: true,
      allow_negatives: false,
    }) &&
    validator.isCurrency(formBook.BookPrice + "", {
      no_symbols: true,
      allow_negatives: false,
    })
  ) {
    // Validation passed
    validatedBook = new Book(
      null,
      formBook.CategoryId,
      // escape is to sanitize - it removes/ encodes any html tags
      validator.escape(formBook.BookName),
      validator.escape(formBook.BookDescription),
      formBook.BookStock,
      formBook.BookPrice
    );
  } else {
    // debug
    console.log("validateNewBook(): Validation failed");
  }

  // return new validated book object
  return validatedBook;
};
// Validate the body data, sent by the client, for a new book
let validateUpdateBook = (formBook) => {
  // Declare constants and variables
  let validatedBook;

  // debug to console - if no data
  if (formBook === null) {
    console.log("validateNewBook(): Parameter is null");
  }

  // Validate form data for new book fields

  if (
    validator.isNumeric(formBook.BookId + "", {
      no_symbols: true,
      allow_negatives: false,
    }) &&
    validator.isNumeric(formBook.CategoryId + "", {
      no_symbols: true,
      allow_negatives: false,
    }) &&
    !validator.isEmpty(formBook.BookName) &&
    !validator.isEmpty(formBook.BookDescription) &&
    validator.isNumeric(formBook.BookStock + "", {
      no_symbols: true,
      allow_negatives: false,
    }) &&
    validator.isCurrency(formBook.BookPrice + "", {
      no_symbols: true,
      allow_negatives: false,
    })
  ) {
    // Validation passed
    // create a new Book instance based on Book model object
    validatedBook = new Book(
      formBook.BookId,
      formBook.CategoryId,

      // escape is to sanitize - it removes/ encodes any html tags
      validator.escape(formBook.BookName),
      validator.escape(formBook.BookDescription),
      formBook.BookStock,
      formBook.BookPrice
    );
  } else {
    // debug
    console.log("validateUpdateBook(): Validation failed");
  }

  // return new validated book object
  return validatedBook;
};

// Module exports
// expose these functions
module.exports = {
  validateId,
  validateNewBook,
  validateUpdateBook,
};
