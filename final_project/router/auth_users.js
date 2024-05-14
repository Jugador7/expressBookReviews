const express = require('express');
const session = require('express-session')
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const app = express();

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login

regd_users.post("/login", (req,res) => {
  console.log("Login request received:", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60});

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn]
  if (book) { //Check is friend exists
      let review = req.body.review;
      if(review) {
        book.reviews.push(review);  // Push new review into the reviews array
        res.status(200).send(`Review added to book with ISBN ${isbn}.`);
      } else {
        res.status(400).send("No review provided!");
      }
  }
  else{
      res.status(404).send("Unable to find book!");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (isbn){
      delete books[isbn]
  }
  res.send(`Review with the isbn  ${isbn} deleted.`);
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
