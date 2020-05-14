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
  for (user in database) {
    for (information in database[user]);
      if (database[user][information] === newVal) {
        return false;
      }
    }
  return true;
}

const addUser = (newUser, database) => {
  const newUserId = randomString();
  newUser.id = newUserId;
  database[newUserId] = newUser;
  return newUser;
}

const fetchUserInfo = (email, database) => {
  for (key in database) {
    if (database[key]['email-address'] === email) {
      return database[key]
    }
  }
}

module.exports = {verifyShortUrl, randomString, checkIfAvail, addUser, fetchUserInfo}