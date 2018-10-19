const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');
const users = require('../../db/user');

return async function jwtAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized, no data' });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized, invalid token' });
  }

  return next();
};

module.exports = jwtAuth;
