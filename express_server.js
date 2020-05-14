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

const {verifyShortUrl, randomString, checkIfAvail, addUser, fetchUserInfo} = require('./helperFunctions');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const userDatabase = {

}

const currentUser = cookie => {
  for (let ids in userDatabase) {
    if (cookie === ids) {
      return userDatabase[ids]['email-address'];
    } 
  }
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
  let templateVars = { urls: urlDatabase, current_user: currentUser(req.cookies['user_id']) };
  res.render("urls_index", templateVars);
});

//Creates new url key
app.get("/urls/new", (req, res) => {
  const current_user = currentUser(req.cookies['user_id'])
  if (!current_user) {
    res.redirect('/login');
  }

  let templateVars = { current_user: current_user }
  res.render("urls_new", templateVars);
});

//Shows webpage for the newly added website
app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  if (verifyShortUrl(shortURL, urlDatabase)) {
    let longURL = urlDatabase[req.params.shortURL];
    let templateVars = { shortURL: shortURL, longURL: longURL, current_user: currentUser(req.cookies['user_id'])};
    res.render("urls_show", templateVars);
  } else {
    res.send('does not exist');
  }
});

//Adds new url to page with all urls
app.post("/urls", (req, res) => {
  const shortURL = randomString();
  const newURL = req.body.longURL;
  urlDatabase[shortURL] = newURL;
  res.redirect(`/urls/${shortURL}`);
});

//Redirect user to longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (verifyShortUrl(shortURL, urlDatabase)) {
    const longURL = urlDatabase[shortURL];
    res.redirect(longURL);
  } else {
    res.status(404);
    res.send('Does not exist');
  }
});

//Delete url:
app.post("/urls/:shortURL/delete", (req, res) => {
  const urlToDelete = req.params.shortURL;
  delete urlDatabase[urlToDelete];
  res.redirect('/urls');
})

//Edit url in database:
app.post("/urls/:shortURL/edit", (req, res) => {
  const key = req.params.shortURL;
  urlDatabase[key] = req.body.longURL
  res.redirect('/urls')
}) 

//Creates new page: registration
app.get("/register", (req, res) => {
  templateVars = { current_user: currentUser(req.cookies['user_id'])}
  res.render("urls_register", templateVars)
})

app.post("/register", (req, res) => {
  const {password} = req.body;
  const email = req.body['email-address']
  if (email === '') {
    res.status(400).send('Error: Please enter an email');
  } else if (password === '') {
    res.status(400).send('Error: Please enter a password');
  } else if (!checkIfAvail(email, userDatabase)) {
    res.status(400).send('Error: Please be original, email already taken');
  } else {
    newUser = addUser(req.body, userDatabase)
    res.cookie('user_id', newUser.id)
    res.redirect('/urls');
  }
  console.log(userDatabase)
})

app.get("/login", (req, res) => {
  templateVars = { current_user: currentUser(req.cookies['user_id'])}
  res.render("login", templateVars);
})

//Working on cookies here
//Give endpoint to hanlde a post to /login
app.post("/login", (req, res) => {
  //Will do a for loop, test first if email addresses match
  const emailUsed = req.body['email-address'];
  const pwdUsed = req.body['password'];

  if (fetchUserInfo(emailUsed, userDatabase)) { //user email matches
    const password = fetchUserInfo(emailUsed, userDatabase).password;
    const id = fetchUserInfo(emailUsed, userDatabase).id
    if (password !== pwdUsed) {
      res.status(403).send('Error 403: Please retype password');
    } else {
      res.cookie('user_id', id);
      res.redirect('/urls');
    }
  } else {
    res.status(403).send('Error 403: E-mail not found')
  }
});

//Give endpoint to handle a post to /logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});