//using express creating router handler
const router = require("express").Router();
const bookService = require("../services/bookService.js");
const userService = require("../services/userService.js");

// Auth0
const {
  authConfig,
  checkJwt,
  checkAuth,
  getUser,
} = require("../middleware/jwtAuth.js");

// GET listing of all books
// Address http://server:port/book
// returns JSON
router.get("/", async (req, res) => {
  let result;

  // Get info from user profile
  // if logged in (therefore access token exists)
  // get token from request
  try {
    if (req.headers["authorization"]) {
      let token = req.headers["authorization"].replace("Bearer ", "");
      const userProfile = await userService.getAuthUser(token);
      console.log("user profile: ", userProfile);
      console.log("user email: ", userProfile.email);
    }
  } catch (err) {
    console.log(`ERROR getting user profile: ${err.message}`);
  }

  // Get books
  try {
    result = await bookService.getBooks();
    res.json(result);

    // Catch and send errors
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// GET a single book by id
// id passed as parameter via url
// Address http://server:port/book/:id
// returns JSON
router.get("/:id", async (req, res) => {
  let result;
  // read value of id parameter from the request url
  const bookId = req.params.id;

  // If validation passed execute query and return results
  // returns a single book with matching id
  try {
    // Send response with JSON result
    result = await bookService.getBookById(bookId);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// GET books by category id
// id passed as parameter via url
// Address http://server:port/product/:id
// returns JSON
router.get("/bycat/:id", async (req, res) => {
  let result;

  // read value of id parameter from the request url
  const categoryId = req.params.id;

  // If validation passed execute query and return results
  // returns a single book with matching id
  try {
    // Send response with JSON result
    result = await bookService.getBookByCatId(categoryId);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// POST Method- for insert a new book.
// This async function sends a HTTP POST request
router.post("/", checkJwt, checkAuth([authConfig.create]), async (req, res) => {
  // the request body contains the new book values - copy it
  const newBook = req.body;

  // show what was copied in the console ( in server side)
  console.log("bookController: ", newBook);

  // Pass the new book data to the service and await the result
  try {
    // Send response with JSON result
    result = await bookService.createBook(newBook);

    // send a json response back to the client
    res.json(result);

    // handle server (status 500) errors
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// PUT update book
// Like post but bookId is provided and method = put
router.put("/", checkJwt, checkAuth([authConfig.update]), async (req, res) => {
  // the request body contains the new book values - copy it
  const book = req.body;

  // show what was copied in the console (in server side)
  console.log("bookController update: ", book);

  // Pass the new book data to the service and await the result
  try {
    // Send response with JSON result
    result = await bookService.updateBook(book);

    // send a json response back to the client
    res.json(result);

    // handle server (status 500) errors
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// DELETE single task.
router.delete(
  "/:id",
  checkJwt,
  checkAuth([authConfig.delete]),
  async (req, res) => {
    let result;
    // read value of id parameter from the request url
    const bookId = req.params.id;
    // If validation passed execute query and return results
    // returns a single book with matching id
    try {
      // Send response with JSON result
      result = await bookService.deleteBook(bookId);
      res.json(result);
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
  }
);

// Export as a module
module.exports = router;
