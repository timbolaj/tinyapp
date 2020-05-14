const bcrypt = require('bcrypt');

//helper function, check if short url exists
const verifyShortUrl = (URL, database) => {
  return database[URL];
};

//Generate random alphaNumeric character
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

//Generate random alphaNumeric string with length of 6
const randomString = () => {
  let randomString = '';
  while (randomString.length < 6) {
    randomString += randomAlphanumIndex();
  }
  return randomString;
};

//helper function to check if a username is already taken (false) or not (true)
const checkIfAvail = (newVal, database) => {
  for (let user in database) {
    if (database[user].email === newVal) {
      return false;
    }
  }
  return true;
};

//helper function to add a new user to the database
const addUser = (newUser, database) => {
  const newUserId = randomString();
  newUser.id = newUserId;
  newUser.password = bcrypt.hashSync(newUser.password, 10);
  database[newUserId] = newUser;
  return newUser;
};

//helper function to grab the info of a user using their e-mail address
const fetchUserInfo = (email, database) => {
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];
    }
  }
  return undefined;
};

//helper function that returns the email of the person currently logged in
const currentUser = (cookie, database) => {
  for (let ids in database) {
    if (cookie === ids) {
      return database[ids].email;  //request.locals
    }
  }
};

//Helper function to return url where the userID is equal to the id of currently logged-in user
const urlsForUser = (id, database) => {
  let currentUserId = id;
  let usersURLs = {};
  for (let key in database) {
    if (database[key].userID === currentUserId) {
      usersURLs[key] = database[key];
    }
  }
  return usersURLs;
};

//helper function to determine if id of user matches that of the link
const checkOwner = (userId, urlID, database) => {
  return userId === database[urlID].userID;
};

module.exports = {verifyShortUrl, randomString, checkIfAvail, addUser, fetchUserInfo, currentUser, urlsForUser, checkOwner};