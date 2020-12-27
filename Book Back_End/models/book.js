//declaring book object to hold book instances
function Book(id = 0, cat = 0, name, desc, stock, price) {
  this.BookId = id;
  this.CategoryId = cat;
  this.BookName = name;
  this.BookDescription = desc;
  this.BookStock = stock;
  this.BookPrice = price;
}

module.exports = Book;
