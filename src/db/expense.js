const { ObjectId } = require('mongodb');
const { getDB } = require('./index');

const collectionName = 'expenses';

async function list() {
  const result = await getDB().collection(collectionName).find().toArray();
  // .skip().limit().sort() ...

  return result;
}

async function get(id) {
  const result = await getDB().collection(collectionName).findOne({ _id: ObjectId(id) });

  return result;
}

async function insert(data) {
  await getDB().collection(collectionName).insertOne(data);

  return data;
}

async function update(id, data) {
  await getDB().collection(collectionName).updateOne({ _id: ObjectId(id) }, { $set: data });

  return data;
}

async function remove(id) {
  await getDB().collection(collectionName).deleteOne({ _id: ObjectId(id) });
}

module.exports = {
  list,
  get,
  insert,
  update,
  remove,
};
