// require the database connection
const bookRepository = require("../repositories/categoryRepository.js");

// Get all categories via the repository
// return categories
let getCategories = async () => {
  let categories = await bookRepository.getCategories();
  return categories;
};

// Module exports
// expose these functions
module.exports = {
  getCategories,
};
