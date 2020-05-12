const express = require("express");
const cookie = require('cookie-parser')
const app = express();
const PORT = 8080;
const morgan = require('morgan');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(cookie());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

//Displays main page with all urls
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies['username'] };
  res.render("urls_index", templateVars);
});

//Creates new url key
app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies['username']}
  res.render("urls_new", templateVars);
});

//Shows webpage for the newly added website
app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  if (verifyShortUrl(shortURL)) {
    let longURL = urlDatabase[req.params.shortURL];
    let templateVars = { shortURL: shortURL, longURL: longURL, username: req.cookies['username']};
    res.render("urls_show", templateVars);
  } else {
    res.send('does not exist');
  }
});

//Adds new url to page with all urls
app.post("/urls", (req, res) => {
  const shortURL = generateShortURL();
  const newURL = req.body.longURL;
  urlDatabase[shortURL] = newURL;
  res.redirect(`/urls/${shortURL}`);
});

//Redirect user to longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (verifyShortUrl(shortURL)) {
    const longURL = urlDatabase[shortURL];
    res.redirect(longURL);
  } else {
    res.status(404);
    res.send('Does not exist');
  }
});

/*Recap
The action attribute urls_index sends the post request to
/delete, a page which we cannot get, but exists in the backend
In the function, we delete the item from the database and redirect the user 
to the page with all the urls
*/

//Delete url:
app.post("/urls/:shortURL/delete", (req, res) => {
  const urlToDelete = req.params.shortURL;
  delete urlDatabase[urlToDelete];
  res.redirect('/urls');
})

/* Recap
In urls_index, we actually want to redirect the user to page
styled by urls_show.ejs and so we used an a tag
From there, like in post, we send the post request to /edit, a page
which the user cannot get but exists in the back end
In the function, we reassign the value
*/

//Edit url in database:
app.post("/urls/:shortURL/edit", (req, res) => {
  const key = req.params.shortURL;
  urlDatabase[key] = req.body.longURL
  res.redirect('/urls')
}) 

//Working on cookies here
//Give endpoint to hanlde a post to /login
app.post("/login", (req, res) => {
  //address edge cases, make sure there's a string
  if (req.body.username) {
    const username = req.body.username;
    res.cookie('username', username);
  }
  res.redirect('/urls');
});

//Give endpoint to handle a post to /logout
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/////Helper functions
const randomAlphanumIndex = () => {
  const alphaLowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const upperCase = alphaLowerCase.toUpperCase();
  const numeric = '1234567890';
  const alphaNumeric = alphaLowerCase + upperCase + numeric;
  //length of alphaNumeric is 62, therefore number generated must be between 0 and 61
  let index = Math.round(Math.random() * 100);
  if (index > 61) {
    while (index > 61) {
      index = Math.round(Math.random() * 100);
    }
  }
  return alphaNumeric[index];
};

const generateShortURL = () => {
  //Generate a unique shortURL - returns string of 6 random alphanum char
  let randomString = '';
  //length of alphanum is 62, therefore, number for index must be between 0 and 61
  while (randomString.length < 6) {
    randomString += randomAlphanumIndex();
  }
  return randomString;
};

//helper function, check if short url exists
const verifyShortUrl = URL => {
  return urlDatabase[URL];
};

