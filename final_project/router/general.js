const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Import Axios


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;


  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
});

public_users.get('/async/', async function (req, res) {
  try {
      let bookList = await new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve(JSON.stringify(books, null, 4));
          }, 2000);  // Simulate a 2-second operation
      });

      res.send(bookList);
  } catch (error) {
      res.status(500).send('Failed to retrieve books');
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
      const isbn = req.params.isbn;  // Get ISBN from the request parameters
      let book = await new Promise((resolve, reject) => {
          setTimeout(() => {
              // Simulate fetching the book by ISBN with a delay
              if (books[isbn]) {
                  resolve(books[isbn]);  // Resolve the promise with the book data
              } else {
                  reject('Book not found');  // Reject the promise if no book is found
              }
          }, 2000);
      });

      res.send(book);  // Send the resolved book data as the response
  } catch (error) {
      res.status(404).send(error);  // Send a 404 status if the book is not found
  }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksFound = [];  // Define an array to hold books found
     // Search through the books to find all with a matching author
  for (let key in books) {
    if (books[key].author === author) {
      booksFound.push(books[key]);  // Add matching books to the array
    }
  }
  
  if (booksFound.length > 0) {
    res.json(booksFound);  // Send all found books as JSON
  } else {
    res.status(404).send('No books found for the author');
  }
});

public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author; // Correctly capture the author parameter
  try {
      let booksFound = await new Promise((resolve, reject) => {
          setTimeout(() => {
              // Simulate fetching the book by author with a delay
              let foundBooks = []; // Initialize an array to collect found books
              for (let key in books) {
                  if (books[key].author === author) {
                      foundBooks.push(books[key]); // Add matching books to the array
                  }
              }

              if (foundBooks.length > 0) {
                  resolve(foundBooks); // Resolve the promise with the found books
              } else {
                  reject('No books found for the author'); // Reject the promise if no books are found
              }
          }, 2000); // Simulate a delay
      });

      res.json(booksFound); // Send the found books as JSON
  } catch (error) {
      res.status(404).send(error); // Send a 404 status if no books are found
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksFound = [];  // Define an array to hold books found
     // Search through the books to find all with a matching author
  for (let key in books) {
    if (books[key].title === title) {
      booksFound.push(books[key]);  // Add matching books to the array
    }
  }
  
  if (booksFound.length > 0) {
    res.json(booksFound);  // Send all found books as JSON
  } else {
    res.status(404).send('No books found for the title');
  }
});

public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title; // Correctly capture the title parameter
  try {
      let booksFound = await new Promise((resolve, reject) => {
          setTimeout(() => {
              // Simulate fetching the book by title with a delay
              let foundBooks = []; // Initialize an array to collect found books
              for (let key in books) {
                  if (books[key].title === title) {
                      foundBooks.push(books[key]); // Add matching books to the array
                  }
              }

              if (foundBooks.length > 0) {
                  resolve(foundBooks); // Resolve the promise with the found books
              } else {
                  reject('No books found for the title'); // Reject the promise if no books are found
              }
          }, 2000); // Simulate a delay
      });

      res.json(booksFound); // Send the found books as JSON
  } catch (error) {
      res.status(404).send(error); // Send a 404 status if no books are found
  }
});

//  Get book review
public_users.get('/review/:id', function (req, res) {
  const id = parseInt(req.params.id);  // Convert the ID from the URL parameter to an integer
  const book = books[id];  // Access the book directly using the ID

  if (book) {
    res.json(book.reviews);  // Send the reviews of the found book as JSON
  } else {
    res.status(404).send('No book found for the given ID');  // Handle the case where no book is found
  }
});


module.exports.general = public_users;
