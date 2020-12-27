//declaring Category object using ES6 arrow function
let Category = (categoryId = 0, categoryName, categoryDescription) => {
  this.CategoryId = categoryId;
  this.CategoryName = categoryName;
  this.CategoryDescription = categoryDescription;
};

module.exports = Category;
