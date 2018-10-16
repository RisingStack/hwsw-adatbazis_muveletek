const { getDB } = require('./index');

async function list() {
  const result = await getDB().collection('expenses').find().toArray();

  return result;
}

module.exports = {
  list,
};
