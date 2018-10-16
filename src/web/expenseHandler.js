const expenses = require('../db/expense');

async function get(req, res) {

}

async function list(req, res) {
  const result = await expenses.list();

  res.send(result);
}

async function insert(req, res) {

}

async function update(req, res) {

}

async function remove(req, res) {

}

module.exports = {
  get, list, insert, update, remove,
};
