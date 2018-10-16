const { MongoClient } = require('mongodb');
const { dbURI } = require('../config');

let mongoClient;

async function connect() {
  mongoClient = await MongoClient.connect(dbURI, { useNewUrlParser: true });
}

function getDB() {
  return mongoClient.db(mongoClient.s.options.db);
}

module.exports = {
  connect,
  getDB,
};
