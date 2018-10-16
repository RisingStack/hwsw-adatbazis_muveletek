const joi = require('joi');
const expenses = require('../db/expense');
// const logger = require('../logger');

const expenseSchema = joi.object({
  name: joi.string().required(),
  amount: joi.number().min(1).required(),
}).unknown().required();

async function get(req, res) {
  const expenseID = req.params.id;

  const result = await expenses.get(expenseID);

  if (!result) {
    res.status(404);
    res.end();
  }

  res.send(result);
}

async function list(req, res) {
  const result = await expenses.list();

  res.send(result);
}

async function insert(req, res) {
  try {
    joi.attempt(req.body, expenseSchema);
  } catch (err) {
    res.status(400);
    res.send(err.details[0].message);
  }

  const result = await expenses.insert(req.body);

  res.status(201);
  res.send(result);
}

async function update(req, res) {
  try {
    joi.attempt(req.body, expenseSchema);
  } catch (err) {
    res.status(400);
    res.send(err.details[0].message);
  }

  const expenseID = req.params.id;

  const result = await expenses.update(expenseID, req.body);

  res.send(result);
}

async function remove(req, res) {
  const expenseID = req.params.id;

  await expenses.remove(expenseID);

  res.status(204);
  res.end();
}

module.exports = {
  get, list, insert, update, remove,
};
