// Dependencies
// require the database connection
const { sql, dbConnPoolPromise } = require("../database/db.js");

// These are parameterised queries note @named parameters.
// Input parameters are parsed and set before queries are executed

// for json path - returning results as JSON FROM MS SQL
const SQL_SELECT_ALL = "SELECT * FROM BookUser for json path;";

const SQL_SELECT_BY_ID =
  "SELECT * FROM BookUser WHERE UserId = @id for json path, without_array_wrapper;";

const SQL_SELECT_BY_EMAIL =
  "SELECT * FROM BookUser  WHERE Email = @email for json path, without_array_wrapper;";

const SQL_INSERT =
  "INSERT INTO BookUser (FirstName, LastName, Email, Password, Role) VALUES (@firstName, @lastName, @email, @password, 'User'); SELECT * from dbo.BookUser WHERE UserId = SCOPE_IDENTITY();";

// Get all books
// This is an async function named getUsers
let getUsers = async () => {
  // define variable to store books
  let users;

  // Get a DB connection and execute SQL (uses imported database module)
  // Note await in try/catch block
  try {
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // execute query
      .query(SQL_SELECT_ALL);

    // first element of the recordset contains books
    users = result.recordset[0];

    // Catch and log errors to cserver side console
  } catch (err) {
    console.log("DB Error - get all users: ", err.message);
  }

  // return books
  return users;
};

// get book by id
// This is an async function named getUserById
let getUserById = async (userId) => {
  let user;

  // returns a single book with matching id
  try {
    // Get a DB connection and execute SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // set @id parameter in the query
      .input("id", sql.Int, userId)
      // execute query
      .query(SQL_SELECT_BY_ID);

    // Send response with JSON result
    user = result.recordset[0];
  } catch (err) {
    console.log("DB Error - get User by id: ", err.message);
  }

  // return the user
  return user;
};

// get user by email
let getUserByEmail = async (email) => {
  let user;

  // returns a single user with matching email
  try {
    // Get a DB connection and execute SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // set @id parameter in the query
      .input("email", sql.NVarChar, email)
      // execute query
      .query(SQL_SELECT_BY_EMAIL);

    // Send response with JSON result
    user = result.recordset[0];
  } catch (err) {
    console.log("DB Error - get User by id: ", err.message);
  }

  // return the user
  return user;
};

// Export
module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
};
