// require import packages, required by the application
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//declaring local host and port
const HOST = "127.0.0.1";
const PORT = 8080;
let app = express();

// Application settings
app.use((req, res, next) => {
  // Globally set Content-Type header for the application
  res.setHeader("Content-Type", "application/json");
  next();
});

// Cookie support
app.use(cookieParser());

// Allow app to support differnt body content types (using the bidyParser package)
app.use(bodyParser.text());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support url encoded bodies

// cors
// https://www.npmjs.com/package/cors
// https://codesquery.com/enable-cors-nodejs-express-app/
// Simple Usage (Enable All CORS Requests)
app.use(cors({ credentials: true, origin: true }));
app.options("*", cors()); // include before other routes

// The default route
app.use("/", require("./controllers/index"));

// route to /book
app.use("/book", require("./controllers/bookController"));

//route to /category
app.use("/category", require("./controllers/categoryController"));

//route to /user
app.use("/user", require("./controllers/userController"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found: " + req.method + ":" + req.originalUrl);
  err.status = 404;
  next(err);
});

// Start the HTTP server using HOST address and PORT consts defined above
// Lssten for incoming connections
var server = app.listen(PORT, HOST, function () {
  console.log(`Express server listening on http://localhost:${PORT}`);
});

// export this as a module, making the app object available when imported.
module.exports = app;
