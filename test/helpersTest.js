const { assert } = require('chai');
const { fetchUserInfo } = require('../helperFunctions')

//fetchUserInfo, should return all the user info based on an e-mail

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    "email-address": "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    "email-address": "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const result = fetchUserInfo('user@example.com', testUsers)
    const expectedOutput = { id: "userRandomID", "email-address": "user@example.com", password: "purple-monkey-dinosaur" };
    // Write your assert statement here
    assert.equal(result.id, expectedOutput.id);
    assert.equal(result.email, expectedOutput.email);
    assert.equal(result.password, expectedOutput.password);
  });

  it('should return a user with valid email', function() {
    const result = fetchUserInfo('user2@example.com', testUsers)
    const expectedOutput = { id: "user2RandomID", "email-address": "user2@example.com", password: "dishwasher-funk" };
    // Write your assert statement here
    assert.equal(result.id, expectedOutput.id);
    assert.equal(result.email, expectedOutput.email);
    assert.equal(result.password, expectedOutput.password);
  });

  it('should return undefined with an invalid email', function() {
    const result = fetchUserInfo('user@example', testUsers)
    const expectedOutput = { id: "userRandomID", "email-address": "user@example.com", password: "purple-monkey-dinosaur" };
    // Write your assert statement here
    assert.equal(result, undefined)
  });
});

