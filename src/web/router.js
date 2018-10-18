const { Router } = require('express');
const getCurrency = require('../currency');
const {
  get, list, insert, update, remove,
} = require('./expenseHandler');
const { register, login } = require('./userHandler');
const auth = require('./auth/cookies');

const router = Router();

router.get('/', (req, res) => {
  res.send({
    message: 'OK',
  });
});

router.get('/currency', async (req, res) => {
  const result = await getCurrency();

  res.send({ message: 'ok', value: result.value });
});

// expense related endpoints
router.get('/expenses', auth, list);
router.get('/expenses/:id', get);
router.post('/expenses', insert);
router.put('/expenses/:id', update);
router.delete('/expenses/:id', remove);

// user related endpoints
router.post('/register', register);
router.post('/login', login);

module.exports = router;
