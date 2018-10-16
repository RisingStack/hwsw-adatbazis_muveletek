const { Router } = require('express');
const getCurrency = require('./currency');

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

module.exports = router;
