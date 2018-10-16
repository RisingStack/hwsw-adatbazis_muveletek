const { Router } = require('express');
const getCurrency = require('../currency');
const {
  get, list, insert, update, remove,
} = require('./expenseHandler');

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

router.get('/expenses', list);
router.get('/expenses/:id', get);
router.post('/expenses', insert);
router.put('/expenses/:id', update);
router.delete('/expenses/:id', remove);

module.exports = router;
