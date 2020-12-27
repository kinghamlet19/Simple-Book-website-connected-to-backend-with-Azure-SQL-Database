// Dependencies
// require the database connection
const { sql, dbConnPoolPromise } = require("../database/db.js");

// models
const Book = require("../models/book.js");
const Category = require("../models/category.js");

// for json path - getting result as JSON from MS SQL
const SQL_SELECT_ALL =
  "SELECT * FROM Book ORDER BY BookName ASC for json path;";

// for json path, without_array_wrapper - used for single json result
const SQL_SELECT_BY_ID =
  "SELECT * FROM Book WHERE BookId = @id for json path, without_array_wrapper;";

// for json path, without_array_wrapper - used for single json result
const SQL_SELECT_BY_CATID =
  "SELECT * FROM Book WHERE CategoryId = @id ORDER BY BookName ASC for json path;";

// returns inserted record identified by BookId = SCOPE_IDENTITY()
const SQL_INSERT =
  "INSERT INTO Book (CategoryId, BookName, BookDescription, BookStock, BookPrice) VALUES (@categoryId, @bookName, @bookDescription, @bookStock, @bookPrice); SELECT * from Book WHERE BookId = SCOPE_IDENTITY();";
const SQL_UPDATE =
  "UPDATE Book SET CategoryId = @categoryId, BookName = @bookName, BookDescription = @bookDescription, BookStock = @bookStock, BookPrice = @bookPrice WHERE BookId = @id; SELECT * FROM Book WHERE BookId = @id;";
const SQL_DELETE = "DELETE FROM Book WHERE BookId = @id;";

// Get all books
// This is an async function named getBooks defined using ES6 arrow function
let getBooks = async () => {
  // define variable to store books
  let books;

  // Get a DB connection and execute SQL (uses imported database module)
  // Note await in try/catch block
  try {
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // execute query
      .query(SQL_SELECT_ALL);

    // first element of the recordset contains books
    books = result.recordset[0];

    // Catch and log errors to server side console
  } catch (err) {
    console.log("DB Error - get all books: ", err.message);
  }

  // return books
  return books;
};

// get book by id
// This is an async function named getBookById defined using ES6 arrow function
let getBookById = async (bookId) => {
  let book;

  // returns a single book with matching id
  try {
    // Get a DB connection and execute SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // set @id parameter in the query
      .input("id", sql.Int, bookId)
      // execute query
      .query(SQL_SELECT_BY_ID);

    // Send response with JSON result
    book = result.recordset[0];
  } catch (err) {
    console.log("DB Error - get book by id: ", err.message);
  }

  // return the book
  return book;
};

// Get books by category
let getBookByCatId = async (categoryId) => {
  let books;

  // returns books with matching category id
  try {
    // Get a DB connection and execute SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // set named parameter(s) in query
      .input("id", sql.Int, categoryId)
      // execute query
      .query(SQL_SELECT_BY_CATID);

    // Send response with JSON result
    books = result.recordset[0];
  } catch (err) {
    console.log("DB Error - get book by category id: ", err.message);
  }

  return books;
};

// insert/ create a new book
// parameter: a validated book model object
let createBook = async (book) => {
  // Declare constants and variables
  let insertedBook;

  // Insert a new book
  try {
    // Get a DB connection and execute SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()

      // set named parameter(s) in query
      // checks for potential sql injection
      .input("categoryId", sql.Int, book.CategoryId)
      .input("bookName", sql.NVarChar, book.BookName)
      .input("bookDescription", sql.NVarChar, book.BookDescription)
      .input("bookStock", sql.Int, book.BookStock)
      .input("bookPrice", sql.Decimal, book.BookPrice)

      // Execute Query
      .query(SQL_INSERT);

    // The newly inserted book is returned by the query
    insertedBook = result.recordset[0];

    // catch and log DB errors
  } catch (err) {
    console.log("DB Error - error inserting a new book: ", err.message);
  }

  // Return the book data
  return insertedBook;
};

// update an existing book
let updateBook = async (book) => {
  // Declare constanrs and variables
  let updatedBook;

  // Inserting a new book
  try {
    // Get a DB connection and execute SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()

      // set named parameter(s) in query
      // checks for potential sql injection
      .input("id", sql.Int, book.BookId)
      .input("categoryId", sql.Int, book.CategoryId)
      .input("bookName", sql.NVarChar, book.BookName)
      .input("bookDescription", sql.NVarChar, book.BookDescription)
      .input("bookStock", sql.Int, book.BookStock)
      .input("bookPrice", sql.Decimal, book.BookPrice)

      // Execute Query
      .query(SQL_UPDATE);

    // The newly inserted book is returned by the query
    updatedBook = result.recordset[0];

    // catch and log DB errors
  } catch (err) {
    console.log("DB Error - error updating book: ", err.message);
  }

  // Return the book data
  return updatedBook;
};

// delete a book
let deleteBook = async (bookId) => {
  // record how many rows were deleted
  let rowsAffected;

  // returns a single book with matching id
  try {
    // Get a DB connection and execute SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // set @id parameter in the query
      .input("id", sql.Int, bookId)
      // execute query
      .query(SQL_DELETE);

    // Was the book deleted?
    rowsAffected = Number(result.rowsAffected);
  } catch (err) {
    console.log("DB Error - get book by id: ", err.message);
  }
  // Nothing deleted
  if (rowsAffected === 0) return false;

  // on successful deletetion
  return true;
};

// Export
module.exports = {
  getBooks,
  getBookById,
  getBookByCatId,
  createBook,
  updateBook,
  deleteBook,
};
