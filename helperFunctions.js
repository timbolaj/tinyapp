const bcrypt = require('bcrypt');

//helper function, check if short url exists
const verifyShortUrl = (URL, database) => {
  return database[URL];
};

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

const randomString = () => {
  //Generate a unique shortURL - returns string of 6 random alphanum char
  let randomString = '';
  //length of alphanum is 62, therefore, number for index must be between 0 and 61
  while (randomString.length < 6) {
    randomString += randomAlphanumIndex();
  }
  return randomString;
};

const checkIfAvail = (newVal, database) => {
  for (let user in database) {
    if (database[user].email === newVal) {
      return false;
    }
  }
  return true;
};

const addUser = (newUser, database) => {
  const newUserId = randomString();
  newUser.id = newUserId;
  newUser.password = bcrypt.hashSync(newUser.password, 10);
  database[newUserId] = newUser;
  return newUser;
};

const fetchUserInfo = (email, database) => {
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];
    }
  }
  return undefined;
};

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