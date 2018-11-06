const { Router } = require('express');
const getCurrency = require('../currency');
const {
  get, list, insert, update, remove,
} = require('./expenseHandler');
const { register, login } = require('./userHandler');
const auth = require('./auth/jwt');

const publicRouter = Router();
const privateRouter = Router();

privateRouter.use(auth);

publicRouter.get('/', (req, res) => {
  setTimeout(() => {
    res.send({
      message: 'OK',
    });
  }, 2000)
});

publicRouter.get('/currency', async (req, res) => {
  const result = await getCurrency();

  res.send({ message: 'ok', value: result.value });
});

// expense related endpoints
privateRouter.get('/expenses', list);
privateRouter.get('/expenses/:id', get);
privateRouter.post('/expenses', insert);
privateRouter.put('/expenses/:id', update);
privateRouter.delete('/expenses/:id', remove);

// user related endpoints
publicRouter.post('/register', register);
publicRouter.post('/login', login);

// HAZI: keszitsetek egy GET /me endpointot ami autentikacio altal vedett
// es az eppen bejelentkezve levo userrrel ter vissza
// (kiszedi a usert az adatbazisbol a req.user alapjan)

module.exports = {
  publicRouter,
  privateRouter,
};
