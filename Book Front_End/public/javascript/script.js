// API Base URL - the server address
const BASE_URL = `http://localhost:8080`;

function getHeaders() {
  // Return headers
  // Note that the access token is set in the Authorization: Bearer
  return new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + getAccessToken(),
  });
}

// Asynchronous Function getDataAsync from a url and return
async function getDataAsync(url) {
  // Requests will use the GET method and permit cross origin requests
  const GET_INIT = {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
    mode: "cors",
    cache: "default",
  };

  // Try catch
  try {
    // Call fetch and await the respose
    // Initally returns a promise
    const response = await fetch(url, GET_INIT);

    // As Resonse is dependant on fetch, await must also be used here
    const json = await response.json();

    return json;

    // catch and log any errors
  } catch (err) {
    console.log(err);
    return err;
  }
}

// Parse JSON
// Create book rows
// Display in web page
function displayBooks(books) {
  // Use the Array map method to iterate through the array of books (in json format)
  // Each books will be formated as HTML table rows and added to the array

  const rows = books.map((book) => {
    // check user permissions
    const showUpdate = checkAuth(UPDATE_BOOK);
    const showDelete = checkAuth(DELETE_BOOK);

    // Show add book button
    if (checkAuth(CREATE_BOOK)) $("#AddBookButton").show();
    else $("#AddBookButton").hide();

    // generate row
    let row = `<tr>
              <td>${book.BookId}</td>
              <td>${book.BookName}</td>
              <td>${book.BookDescription}</td>
              <td>${book.BookStock}</td>
              <td class="price">&euro;${Number(book.BookPrice).toFixed(
                2
              )}</td>`;

    // if user has permission to update - then add the edit button
    if (showUpdate)
      row += `<td><button class="btn btn-xs" data-toggle="modal" 
                data-target="#BookFormDialog" onclick="prepareBookUpdate(${book.BookId})">
                <span class="oi oi-pencil" data-toggle="tooltip" title="Edit Book"></span></button></td>`;
    // if user has permission to delete - then add the delete button
    if (showDelete)
      row += `<td><button class="btn btn-xs" onclick="deleteBook(${book.BookId})">
                <span class="oi oi-trash" data-toggle="tooltip" title="Delete Book"></span></button></td>`;

    // finally, end the row and return
    row += "</tr>";
    return row;
  });
  // Set the innerHTML of the bookRows root element = rows
  document.getElementById("bookRows").innerHTML = rows.join("");
} // end function

// load and display categories in thhe left menu
function displayCategories(categories) {
  //console.log(categories);
  // Cat menu
  // use Array.map() to iterate through the list of categories
  // Returns an HTML link for each category in the array
  const catLinks = categories.map((category) => {
    // The link has an onclick handler which will call updateBooksView(id) pasing the category id as a parameter
    return `<a href="#" class="list-group-item list-group-item-action" onclick="updateBooksView(${category.CategoryId})">${category.CategoryName}</a>`;
  });

  // use  unshift to add a 'Show all' link at the start of the array of catLinks
  catLinks.unshift(
    `<a href="#" class="list-group-item list-group-item-action" onclick="loadBooks()">Show all</a>`
  );

  document.getElementById("categoryList").innerHTML = catLinks.join("");

  let catSelect = document.getElementById("CategoryId");

  // clear options
  while (catSelect.firstChild) catSelect.removeChild(catSelect.firstChild);

  // Add an option for each category
  // iterate through categories adding each to the end of the options list
  // each option is made from categoryName, categoryId
  // Start with default option
  catSelect.add(new Option("Choose Category", "0"));
  for (i = 0; i < categories.length; i++) {
    catSelect.add(
      new Option(categories[i].CategoryName, categories[i].CategoryId)
    );
  }
} // end function

// Load Books
// Get all categories and books then display
async function loadBooks() {
  try {
    // Get a list of categories via the getDataAsync(url) function
    const categories = await getDataAsync(`${BASE_URL}/category`);
    // Call displaycategoriess(), passing the retrieved categories list
    if (categories != null) displayCategories(categories);

    // Get a list of books
    const books = await getDataAsync(`${BASE_URL}/book`);
    // Call displayBooks(), passing the retrieved books list
    if (books != null) displayBooks(books);
  } catch (err) {
    // catch and log any errors
    console.log(err);
  }
}

// update books list when category is selected to show only books from that category
async function updateBooksView(id) {
  try {
    // call the API enpoint which retrieves books by category id
    const books = await getDataAsync(`${BASE_URL}/book/bycat/${id}`);
    // Display the list of books returned by the API
    if (books != null) {
      displayBooks(books);
    }
  } catch (err) {
    // catch and log any errors
    console.log(err);
  }
}

// Get form data and return as object for POST
// Uppercase first char to match DB
function getBookForm() {
  // Get form fields
  const bId = document.getElementById("BookId").value;
  const catId = document.getElementById("CategoryId").value;
  const bName = document.getElementById("BookName").value;
  const bDesc = document.getElementById("BookDescription").value;
  const bStock = document.getElementById("BookStock").value;
  const bPrice = document.getElementById("BookPrice").value;

  // build Book object for Insert or Update
  // required for sending to the API
  const bookObj = {
    BookId: bId,
    CategoryId: catId,
    BookName: bName,
    BookDescription: bDesc,
    BookStock: bStock,
    BookPrice: bPrice,
  };

  // return the body data
  return bookObj;
}

// Setup book form
function bookFormSetup(title) {
  // reset the form and change the title
  document.getElementById("bookForm").reset();
  document.getElementById("bookFormTitle").innerHTML = title;

  document.getElementById("BookId").value = 0;
}

async function addOrUpdateBook() {
  // url for api call
  const url = `${BASE_URL}/book`;
  let httpMethod = "POST";

  const bookObj = getBookForm();

  if (bookObj.BookId > 0) {
    httpMethod = "PUT";
  }

  // build the request object - note: POST
  // reqBodyJson added to the req body
  const request = {
    method: httpMethod,
    headers: getHeaders(),
    credentials: "include",
    mode: "cors",
    // convert JS Object to JSON and add to request body
    body: JSON.stringify(bookObj),
  };

  // Try catch
  try {
    // Call fetch and await the respose
    // fetch url using request object
    const response = await fetch(url, request);
    const json = await response.json();

    // Output result to console (for testing purposes)
    console.log(json);

    // catch and log any errors
  } catch (err) {
    console.log(err);
    return err;
  }
  // Refresh books list
  loadBooks();
}

// When a book is selected for update/ editing, get it by id and fill out the form
async function prepareBookUpdate(id) {
  try {
    // Get book by id
    const book = await getDataAsync(`${BASE_URL}/book/${id}`);

    // Set form defaults
    bookFormSetup(`Update Book ID: ${book.BookId}`);

    // Fill out the form
    document.getElementById("BookId").value = book.BookId;
    document.getElementById("CategoryId").value = book.CategoryId;
    document.getElementById("BookName").value = book.BookName;
    document.getElementById("BookDescription").value = book.BookDescription;
    document.getElementById("BookStock").value = book.BookStock;
    document.getElementById("BookPrice").value = book.BookPrice;
  } catch (err) {
    // catch and log any errors
    console.log(err);
  }
}

// Delete book by id using an HTTP DELETE request
async function deleteBook(id) {
  const request = {
    method: "DELETE",
    headers: getHeaders(),
    credentials: "include",
    mode: "cors",
  };

  if (confirm("Are you sure you want to delete the book?")) {
    // url
    const url = `${BASE_URL}/book/${id}`;

    // Try catch
    try {
      const result = await fetch(url, request);
      const response = await result.json();

      if (response == true) loadBooks();

      // catch and log any errors
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

// Alternative for getting for data
// used formData object
function getBookFormAlt() {
  // Get form + data
  const bookForm = document.getElementById("bookForm");
  const formData = new FormData(bookForm);

  let newBook = {};
  formData.forEach((value, key) => (newBook[key] = value));

  // return book json
  return JSON.stringify(newBook);
}

// When this script is loaded, call loadBooks() function to add books to the page
loadBooks();
