const express = require("express");
const cookie = require('cookie-parser');
const app = express();
const PORT = 8080;
const morgan = require('morgan');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(cookie());

const {verifyShortUrl, randomString, checkIfAvail, addUser, fetchUserInfo, currentUser, urlsForUser} = require('./helperFunctions');

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "bob123"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "bob123"},
};

const userDatabase = {
  "bob123": {id: "bob123", "email-address": "bob123", password: "bob123"},
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Creates new page: registration
app.get("/register", (req, res) => {
  let templateVars = { current_user: currentUser(req.cookies['user_id'], userDatabase)};
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const {password} = req.body;
  const email = req.body['email-address'];
  if (email === '') {
    res.status(400).send('Error: Please enter an email');
  } else if (password === '') {
    res.status(400).send('Error: Please enter a password');
  } else if (!checkIfAvail(email, userDatabase)) {
    res.status(400).send('Error: Please be original, email already taken');
  } else {
    const newUser = addUser(req.body, userDatabase);
    res.cookie('user_id', newUser.id);
    res.redirect('/urls');
  }
});

app.get("/login", (req, res) => {
  let templateVars = { current_user: currentUser(req.cookies['user_id'], userDatabase)};
  res.render("login", templateVars);
});

//Working on cookies here
//Give endpoint to hanlde a post to /login
app.post("/login", (req, res) => {
  //Will do a for loop, test first if email addresses match
  const emailUsed = req.body['email-address'];
  const pwdUsed = req.body['password'];

  if (fetchUserInfo(emailUsed, userDatabase)) { //user email matches
    const password = fetchUserInfo(emailUsed, userDatabase).password;
    const id = fetchUserInfo(emailUsed, userDatabase).id;
    if (password !== pwdUsed) {
      res.status(403).send('Error 403: Please retype password');
    } else {
      res.cookie('user_id', id);
      res.redirect('/urls');
    }
  } else {
    res.status(403).send('Error 403: E-mail not found');
  }
});

//Displays main page with all urls
//First thing, ensure that those who aren't signed in can't see this and prompted to sign in or register first - done
//page needs to also filter out the pages not associated with those of the current user - done
app.get("/urls", (req, res) => {
  const current_user = currentUser(req.cookies['user_id'], userDatabase);
  if (!current_user) {
    res.send("<html><body>Please sign in or register</body></html");
  }
  //use helper function to find the links that belong to the user
  const usersLinks = urlsForUser(current_user, urlDatabase);

  let templateVars = { urls: usersLinks, current_user: currentUser(req.cookies['user_id'], userDatabase) };
  res.render("urls_index", templateVars);
});

//Creates new url key
app.get("/urls/new", (req, res) => {
  const current_user = currentUser(req.cookies['user_id'], userDatabase);
  if (!current_user) {
    res.redirect('/login');
  }

  let templateVars = { current_user: current_user };
  res.render("urls_new", templateVars);
});

//Shows webpage for the newly added website
//Dont want different users to see this
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const current_user = currentUser(req.cookies['user_id'], userDatabase);
  if (!urlDatabase[shortURL]) {
    res.send("The link does not exist");
  } else if (current_user !== urlDatabase[shortURL].userID) {
    res.send('This id does not belong to you');
  }

  if (verifyShortUrl(shortURL, urlDatabase)) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    let templateVars = { shortURL: shortURL, longURL: longURL, current_user: currentUser(req.cookies['user_id'], userDatabase)};
    res.render("urls_show", templateVars);
  } else {
    res.send('does not exist');
  }
});

//Adds new url to page with all urls
app.post("/urls", (req, res) => {
  const shortURL = randomString();
  const newURL = req.body.longURL;
  const user = currentUser(req.cookies['user_id'], userDatabase);
  urlDatabase[shortURL] = { longURL: newURL, userID: user };
  res.redirect(`/urls/${shortURL}`);
});

//Redirect user to longURL
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  if (verifyShortUrl(shortURL, urlDatabase)) {
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  } else {
    res.status(404);
    res.send('Does not exist');
  }
});

//Delete url:
app.post("/urls/:shortURL/delete", (req, res) => {
  const current_user = currentUser(req.cookies['user_id'], userDatabase);
  const shortURL = req.params.shortURL;
  if (current_user !== urlDatabase[shortURL].userID) {
    res.send('This id does not belong to you');
  }

  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

//Edit url in database:
app.post("/urls/:shortURL/edit", (req, res) => {
  const current_user = currentUser(req.cookies['user_id'], userDatabase);
  const shortURL = req.params.shortURL;
  if (current_user !== urlDatabase[shortURL].userID) {
    res.send('This id does not belong to you');
  }

  urlDatabase[shortURL].longURL = req.body.longURL;
  res.redirect('/urls');
});

//Give endpoint to handle a post to /logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});