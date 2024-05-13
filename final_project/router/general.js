const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
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
