// Depencencies
const router = require("express").Router();

const categoryService = require("../services/categoryService.js");

// GET listing of all categories
// Address http://server:port/category
// returns JSON
router.get("/", async (req, res) => {
  let result;
  // Get categories
  try {
    // Call the category service to get all categories
    result = await categoryService.getCategories();
    res.json(result);

    // Catch and send errors
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// Export as a module
module.exports = router;
