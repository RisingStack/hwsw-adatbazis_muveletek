const { MongoClient } = require('mongodb');
const { dbURI } = require('../config');

let mongoClient;

async function connect() {
  mongoClient = await MongoClient.connect(dbURI);
}

module.exports = {
  connect,
};
