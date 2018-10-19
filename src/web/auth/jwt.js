const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');

async function jwtAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).send({ message: 'Unauthorized, no data' });
  }

  const [scheme, token] = auth.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).send({ message: 'Unauthorized, invalid token' });
  }

  try {
    // HAZI 1: szedjetek le a usert a db-bol es azt tegyetek fel a req.user-re
    // a token belseje helyett
    req.user = jwt.verify(token, jwtSecret);
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized, invalid token' });
  }

  return next();
}

module.exports = jwtAuth;
