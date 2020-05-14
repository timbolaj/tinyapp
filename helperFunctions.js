//helper function, check if short url exists
const verifyShortUrl = (URL, database) => {
  return database[URL];
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

const checkIfAvail = (newVal, database) => {
  for (let user in database) {
    if (database[user]['email-address'] === newVal) {
      return false;
    }
  }
  return true;
};

const addUser = (newUser, database) => {
  const newUserId = randomString();
  newUser.id = newUserId;
  database[newUserId] = newUser;
  return newUser;
};

const fetchUserInfo = (email, database) => {
  for (let key in database) {
    if (database[key]['email-address'] === email) {
      return database[key];
    }
  }
};

const currentUser = (cookie, database) => {
  for (let ids in database) {
    if (cookie === ids) {
      return database[ids]['email-address'];
    }
  }
};

//Helper function to return url where the userID is equal to the id of currently logged-in user
const urlsForUser = (id, database) => {
  //want to return the urls of the userID
  //remember that in the urlDatabase, there is a user id associated with each url
  //For current user, we can use the cookies
  //Parse out the variables from the cookie method
  //Go into the urlDatabase to get the urls
  let currentUserId = id;
  let usersURLs = {};
  for (let key in database) {
    if (database[key].userID === currentUserId) {
      usersURLs[key] = database[key];
    }
  }
  return usersURLs;
};

module.exports = {verifyShortUrl, randomString, checkIfAvail, addUser, fetchUserInfo, currentUser, urlsForUser};