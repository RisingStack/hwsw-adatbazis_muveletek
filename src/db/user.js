const { getDB } = require('./index');

const collectionName = 'users';

async function register(userData) {
  await getDB()
    .collection(collectionName)
    .insertOne(userData);

  return userData;
}

async function findByEmail(email) {
  return getDB()
    .collection(collectionName)
    .findOne({ email });
}

module.exports = {
  register,
  findByEmail,
};
