// app.js

// Define an instance of Express
const express = require("express");

// Define Express App
const app = express();

// TCP port
const PORT = 3000;

// Serve Static Assets from the public folder
app.use(express.static("public"));

// Start the server and listen on the port defined above
// Display a console message to indicate that the server started and is running
app.listen(PORT, () => {
  console.log(`Server connected at http://localhost:${PORT}`);
});
